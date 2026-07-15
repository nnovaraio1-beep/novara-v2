import { getCurrentAdmin, type CurrentAdmin } from "./auth";
import { can, type Permission, type Grant } from "./rbac";
import { db } from "@/server/db";

export class UnauthorizedError extends Error { constructor() { super("Not authenticated"); this.name = "UnauthorizedError"; } }
export class ForbiddenError extends Error { constructor(public permission: string) { super(`Missing permission: ${permission}`); this.name = "ForbiddenError"; } }

/** Require a logged-in admin. Throws UnauthorizedError otherwise. */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}

/** Require a specific permission — SERVER-SIDE (§2: "No client-only authorization"). */
export async function requirePermission(permission: Permission): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (!db) throw new UnauthorizedError();
  const grants = await db.permissionGrant.findMany({ where: { userId: admin.id } });
  const g: Grant[] = grants.map((x) => ({ permission: x.permission, granted: x.granted }));
  if (!can(admin.role, permission, g)) throw new ForbiddenError(permission);
  return admin;
}

export async function requireSuperAdmin(): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") throw new ForbiddenError("super_admin");
  return admin;
}
