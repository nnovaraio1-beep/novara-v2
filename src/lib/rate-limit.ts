/** Fixed-window limiter, in memory. Per-instance only — swap for Redis before real traffic. */
const hits = new Map<string, { count: number; resetAt: number }>();
export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now(); const e = hits.get(key);
  if (!e || now > e.resetAt) { hits.set(key, { count: 1, resetAt: now + windowMs }); return { ok: true, retryAfter: 0 }; }
  e.count += 1; if (e.count > limit) return { ok: false, retryAfter: Math.ceil((e.resetAt - now) / 1000) };
  return { ok: true, retryAfter: 0 };
}
export const clientKey = (req: Request) => (req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim();
