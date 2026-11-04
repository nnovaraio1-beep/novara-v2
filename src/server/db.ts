import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton. Admin content is stored HERE (Postgres), never localStorage (§30).
 *
 * If DATABASE_URL is unset, `db` is null and every admin data path must degrade
 * to a clear "database not configured" state rather than pretending to work.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.NEXT_PUBLIC_SITE_URL === "https://novara-hyperpay-staging.netlify.app"
  ? (process.env.NETLIFY_DB_URL ?? process.env.DATABASE_URL)
  : process.env.DATABASE_URL;

export const db: PrismaClient | null = databaseUrl
  ? (globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: databaseUrl }))
  : null;

if (process.env.NODE_ENV !== "production" && db) globalForPrisma.prisma = db;

export const databaseConfigured = () => Boolean(databaseUrl);

/** Use in server actions/routes that require the DB — throws a typed, honest error. */
export function requireDb(): PrismaClient {
  if (!db) throw new AdminNotConfiguredError();
  return db;
}

export class AdminNotConfiguredError extends Error {
  constructor() { super("The admin database is not configured. Set DATABASE_URL and run migrations."); this.name = "AdminNotConfiguredError"; }
}
