import { ForbiddenError, UnauthorizedError, requirePermission } from "./guard";
import { assertCsrf } from "./csrf";
import { audit } from "./audit";
import { AdminNotConfiguredError } from "@/server/db";
import { ValidationError } from "@/lib/validate";
import type { Permission } from "./rbac";

/** Uniform result shape every admin mutation returns to the client. */
export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

interface RunOptions {
  permission: Permission;
  csrf?: string | null;
  audit?: { action: string; entityType?: string; entityId?: string; before?: unknown; after?: unknown };
}

/**
 * Wrap a mutation with: server-side permission enforcement, optional CSRF check,
 * typed error → friendly message, and audit logging. Every write action uses this
 * so authorization is never left to the UI.
 */
export async function runAction<T>(opts: RunOptions, fn: (actor: Awaited<ReturnType<typeof requirePermission>>) => Promise<T>): Promise<ActionResult<T>> {
  try {
    const actor = await requirePermission(opts.permission);
    if (opts.csrf !== undefined) await assertCsrf(opts.csrf);
    const data = await fn(actor);
    if (opts.audit) {
      await audit({ actorId: actor.id, actorEmail: actor.email, action: opts.audit.action, entityType: opts.audit.entityType, entityId: opts.audit.entityId, before: opts.audit.before, after: opts.audit.after });
    }
    return { ok: true, data };
  } catch (e) {
    if (e instanceof ValidationError) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: Object.fromEntries(e.issues.map((i) => [i.path, i.message])) };
    if (e instanceof UnauthorizedError) return { ok: false, error: "Your session has expired. Please sign in again." };
    if (e instanceof ForbiddenError) return { ok: false, error: `You don't have permission for this action (${e.permission}).` };
    if (e instanceof AdminNotConfiguredError) return { ok: false, error: "The admin database is not configured." };
    console.error("[admin action]", e);
    return { ok: false, error: "Something went wrong. No changes were saved." };
  }
}

/** Slugify helper shared by content forms. */
export function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}
