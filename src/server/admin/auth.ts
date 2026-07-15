import { db } from "@/server/db";
import type { AdminUser } from "@prisma/client";
import { verifyPassword } from "./password";
import { createSession, getSessionContext, setSessionCookie } from "./session";
import { can, defaultPermissionsFor, type Permission, type Grant } from "./rbac";

const MAX_ATTEMPTS = 5;
const LOCK_MS = 1000 * 60 * 15; // 15-minute lockout after 5 failures

export type LoginResult =
  | { ok: true; mustChangePassword: boolean }
  | { ok: false; reason: "invalid" | "locked" | "inactive" | "not_configured" };

/**
 * Login (§2). Real password verification, per-account failed-attempt throttling
 * and lockout. The generic "invalid" reason is returned for both unknown email
 * and wrong password so we don't reveal which accounts exist.
 */
export async function login(email: string, password: string, ip?: string, ua?: string): Promise<LoginResult> {
  if (!db) return { ok: false, reason: "not_configured" };
  const user = await db.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) { await burnTime(); return { ok: false, reason: "invalid" }; }
  if (user.lockedUntil && user.lockedUntil > new Date()) return { ok: false, reason: "locked" };
  if (!user.isActive) return { ok: false, reason: "inactive" };

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) {
    const failed = user.failedAttempts + 1;
    await db.adminUser.update({
      where: { id: user.id },
      data: failed >= MAX_ATTEMPTS ? { failedAttempts: 0, lockedUntil: new Date(Date.now() + LOCK_MS) } : { failedAttempts: failed },
    });
    await db.auditLog.create({ data: { actorId: user.id, actorEmail: user.email, action: "failed_login", ipAddress: ip, userAgent: ua } });
    return { ok: false, reason: "invalid" };
  }

  await db.adminUser.update({ where: { id: user.id }, data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() } });
  const { token } = await createSession(user.id, ip, ua);
  await setSessionCookie(token);
  await db.auditLog.create({ data: { actorId: user.id, actorEmail: user.email, action: "login", ipAddress: ip, userAgent: ua } });
  return { ok: true, mustChangePassword: user.mustChangePassword };
}

// Equalize timing between "no such user" and "wrong password" paths.
async function burnTime() {
  await verifyPassword("$argon2id$v=19$m=19456,t=2,p=1$YWFhYWFhYWFhYWFhYWFhYQ$0000000000000000000000000000000000000000000", "x").catch(() => {});
}

export interface CurrentAdmin {
  id: string; email: string; name: string; role: AdminUser["role"];
  mustChangePassword: boolean; permissions: Permission[]; sessionId: string; csrfToken: string;
}

/** Resolve the authenticated admin + effective permissions, or null. */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const ctx = await getSessionContext();
  if (!ctx || !db) return null;
  const user = await db.adminUser.findUnique({ where: { id: ctx.userId } });
  if (!user || !user.isActive) return null;
  const grants = await db.permissionGrant.findMany({ where: { userId: user.id } });
  const g: Grant[] = grants.map((x) => ({ permission: x.permission, granted: x.granted }));
  const permissions = defaultPermissionsFor(user.role).filter((p) => can(user.role, p, g));
  const extra = g.filter((x) => x.granted && !permissions.includes(x.permission as Permission)).map((x) => x.permission as Permission);
  return {
    id: user.id, email: user.email, name: user.name, role: user.role,
    mustChangePassword: user.mustChangePassword,
    permissions: user.role === "super_admin" ? (permissions.length ? permissions : []) : [...permissions, ...extra],
    sessionId: ctx.sessionId, csrfToken: ctx.csrfToken,
  };
}
