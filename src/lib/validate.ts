/** Tiny structural validator (Zod-shaped parse() for easy later swap). Nothing from a request body reaches logic untyped. */
export class ValidationError extends Error { constructor(public issues: { path: string; message: string }[]) { super("Validation failed"); this.name = "ValidationError"; } }
type Check<T> = (v: unknown, path: string) => T;
const fail = (p: string, m: string): never => { throw new ValidationError([{ path: p, message: m }]); };
export const v = {
  string: (o: { min?: number; max?: number } = {}): Check<string> => (raw, p) => {
    if (typeof raw !== "string") return fail(p, "expected a string");
    const s = raw.trim();
    if (o.min !== undefined && s.length < o.min) return fail(p, `min ${o.min} chars`);
    if (o.max !== undefined && s.length > o.max) return fail(p, `max ${o.max} chars`);
    return s;
  },
  email: (): Check<string> => (raw, p) => { const s = v.string({ min: 3, max: 254 })(raw, p); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return fail(p, "invalid email"); return s.toLowerCase(); },
  int: (o: { min?: number; max?: number } = {}): Check<number> => (raw, p) => { const n = typeof raw === "number" ? raw : Number(raw); if (!Number.isInteger(n)) return fail(p, "must be an integer"); if (o.min !== undefined && n < o.min) return fail(p, `min ${o.min}`); if (o.max !== undefined && n > o.max) return fail(p, `max ${o.max}`); return n; },
  literal: <T extends string>(...a: T[]): Check<T> => (raw, p) => (typeof raw === "string" && (a as string[]).includes(raw)) ? raw as T : fail(p, `one of ${a.join(", ")}`),
  optional: <T>(inner: Check<T>): Check<T | undefined> => (raw, p) => raw === undefined || raw === null || raw === "" ? undefined : inner(raw, p),
  array: <T>(inner: Check<T>, o: { max?: number } = {}): Check<T[]> => (raw, p) => { if (!Array.isArray(raw)) return fail(p, "expected array"); if (o.max !== undefined && raw.length > o.max) return fail(p, `max ${o.max} items`); return raw.map((x, i) => inner(x, `${p}[${i}]`)); },
  object: <S extends Record<string, Check<unknown>>>(shape: S): Check<{ [K in keyof S]: S[K] extends Check<infer R> ? R : never }> => (raw, p) => {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return fail(p, "expected object");
    const src = raw as Record<string, unknown>; const out: Record<string, unknown> = {}; const issues: { path: string; message: string }[] = [];
    for (const [k, c] of Object.entries(shape)) { try { out[k] = c(src[k], p ? `${p}.${k}` : k); } catch (e) { if (e instanceof ValidationError) issues.push(...e.issues); else throw e; } }
    if (issues.length) throw new ValidationError(issues); return out as never;
  },
};
export function parse<T>(check: Check<T>, data: unknown): T { return check(data, ""); }
