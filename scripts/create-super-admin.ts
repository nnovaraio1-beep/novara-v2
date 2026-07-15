/**
 * First-run super admin setup (§34).
 * Run: npm run admin:setup   (after DATABASE_URL is set and migrations applied)
 *
 * Reads ADMIN_INITIAL_EMAIL / _PASSWORD / _NAME from the environment. Creates the
 * super admin ONLY if no admin user exists yet. Password is hashed with argon2id.
 * The account is flagged mustChangePassword so the operator rotates it on first login.
 * No credentials are ever hardcoded or committed.
 */
import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_INITIAL_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  const name = process.env.ADMIN_INITIAL_NAME ?? "Super Admin";

  if (!email || !password) {
    console.error("✗ Set ADMIN_INITIAL_EMAIL and ADMIN_INITIAL_PASSWORD in the environment first.");
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("✗ ADMIN_INITIAL_PASSWORD must be at least 12 characters.");
    process.exit(1);
  }

  const existing = await prisma.adminUser.count();
  if (existing > 0) {
    console.log("✓ An admin user already exists — no action taken (first-run only).");
    return;
  }

  const passwordHash = await hash(password, { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 });
  const user = await prisma.adminUser.create({
    data: { email, name, passwordHash, role: "super_admin", isActive: true, mustChangePassword: true },
  });
  await prisma.auditLog.create({ data: { actorId: user.id, actorEmail: user.email, action: "super_admin_created" } });
  console.log(`✓ Super admin created: ${email}`);
  console.log("  You'll be required to change this password on first login.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
