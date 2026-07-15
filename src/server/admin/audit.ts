import { db } from "@/server/db";

const SECRET_KEYS = /(password|secret|token|key|cvv|card|authorization|cookie)/i;

/** Recursively strip anything that looks like a secret before it's written (§25). */
function scrub(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(scrub);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, SECRET_KEYS.test(k) ? "[redacted]" : scrub(v)]));
  }
  return value;
}

export interface AuditInput {
  actorId?: string; actorEmail?: string; action: string;
  entityType?: string; entityId?: string; ip?: string; ua?: string;
  before?: unknown; after?: unknown;
}

/** Append-only audit entry. Never throws into the caller — logging must not break a mutation. */
export async function audit(input: AuditInput): Promise<void> {
  if (!db) return;
  try {
    await db.auditLog.create({
      data: {
        actorId: input.actorId, actorEmail: input.actorEmail, action: input.action,
        entityType: input.entityType, entityId: input.entityId, ipAddress: input.ip, userAgent: input.ua,
        before: input.before !== undefined ? (scrub(JSON.parse(JSON.stringify(input.before))) as object) : undefined,
        after: input.after !== undefined ? (scrub(JSON.parse(JSON.stringify(input.after))) as object) : undefined,
      },
    });
  } catch (e) { console.error("[audit] failed:", (e as Error).message); }
}
