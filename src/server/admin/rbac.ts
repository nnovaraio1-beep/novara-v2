import type { AdminRole } from "@prisma/client";

/**
 * Granular permission strings (§20). Checks are on PERMISSIONS, not role names
 * (§20: "Do not rely on role names only"). Roles map to a default permission
 * set; per-user PermissionGrant rows can add or revoke on top.
 */
export const PERMISSIONS = [
  "content.read", "content.write", "content.publish",
  "store.read", "store.write",
  "media.read", "media.write",
  "orders.read", "orders.write",
  "quotations.read", "quotations.write",
  "customers.read", "customers.write",
  "forms.read", "forms.write",
  "translations.read", "translations.write",
  "seo.read", "seo.write",
  "theme.read", "theme.write",
  "navigation.write",
  "legal.write",
  "users.manage",
  "payments.manage",
  "settings.manage",
  "audit.read",
  "backups.manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const ALL = [...PERMISSIONS] as Permission[];

const READONLY: Permission[] = ["content.read","store.read","media.read","orders.read","quotations.read","customers.read","forms.read","translations.read","seo.read","theme.read","audit.read"];

/** Default permissions per role. super_admin gets everything, always. */
const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  super_admin: ALL,
  admin: ALL.filter((p) => !["users.manage","payments.manage","backups.manage"].includes(p)),
  content_manager: ["content.read","content.write","content.publish","media.read","media.write","translations.read","translations.write","seo.read","seo.write"],
  store_manager: ["store.read","store.write","orders.read","orders.write","quotations.read","quotations.write","customers.read","media.read"],
  support_agent: ["orders.read","quotations.read","customers.read","customers.write","forms.read","forms.write"],
  viewer: READONLY,
};

export function defaultPermissionsFor(role: AdminRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/** Actions only super_admin may ever perform (§2). */
export const SUPER_ADMIN_ONLY: Permission[] = ["users.manage","payments.manage","settings.manage","backups.manage"];

export interface Grant { permission: string; granted: boolean }

/** Effective check: role defaults, then explicit grants/revokes, then super_admin override. */
export function can(role: AdminRole, permission: Permission, grants: Grant[] = []): boolean {
  if (role === "super_admin") return true;
  const revoked = grants.some((g) => g.permission === permission && !g.granted);
  if (revoked) return false;
  if (grants.some((g) => g.permission === permission && g.granted)) return true;
  return defaultPermissionsFor(role).includes(permission);
}

export function isPermission(value: string): value is Permission {
  return (PERMISSIONS as readonly string[]).includes(value);
}
