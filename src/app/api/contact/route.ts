import { NextResponse } from "next/server";
import { parse, v, ValidationError } from "@/lib/validate";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { hasTrustedOrigin, readJson, RequestTooLargeError } from "@/lib/security/request";
import { db } from "@/server/db";
import { mailConfigured, sendContactMail } from "@/server/mail";

export const runtime = "nodejs";
const schema = v.object({
  name: v.string({ min: 2, max: 120 }), email: v.email(), company: v.optional(v.string({ max: 160 })),
  phone: v.optional(v.string({ max: 40 })), message: v.string({ min: 10, max: 4000 }),
  website: v.optional(v.string({ max: 200 })), startedAt: v.int({ min: 0 }), locale: v.literal("ar", "en"),
});

export async function POST(req: Request) {
  if (!hasTrustedOrigin(req)) return NextResponse.json({ error: "invalid_request" }, { status: 403 });
  const limited = rateLimit(`contact:${clientKey(req)}`, 5, 15 * 60_000);
  if (!limited.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limited.retryAfter) } });
  let body;
  try { body = parse(schema, await readJson(req, 12 * 1024)); }
  catch (error) {
    const status = error instanceof RequestTooLargeError ? 413 : 400;
    return NextResponse.json({ error: "invalid", issues: error instanceof ValidationError ? error.issues : undefined }, { status });
  }
  // Honeypot and minimum completion time reduce automated submissions without tracking users.
  if (body.website || Date.now() - body.startedAt < 2500 || Date.now() - body.startedAt > 24 * 60 * 60_000) {
    return NextResponse.json({ ok: true });
  }
  if (!db && !mailConfigured()) return NextResponse.json({ error: "temporarily_unavailable" }, { status: 503 });
  let stored = false;
  try { if (db) { await db.formSubmission.create({ data: { type: "contact", data: { name: body.name, email: body.email, company: body.company, phone: body.phone, message: body.message, locale: body.locale } } }); stored = true; } }
  catch { console.error("[contact] database delivery failed"); }
  try { if (mailConfigured()) await sendContactMail(body); else if (!stored) throw new Error("mail unavailable"); }
  catch { if (!stored) { console.error("[contact] delivery failed"); return NextResponse.json({ error: "temporarily_unavailable" }, { status: 503 }); } console.error("[contact] email delivery failed; submission retained"); }
  return NextResponse.json({ ok: true }, { status: 201 });
}
