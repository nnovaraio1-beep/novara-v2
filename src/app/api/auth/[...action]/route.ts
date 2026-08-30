import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { databaseConfigured } from "@/server/db";
import { registerCustomer, loginCustomer, logoutCustomer } from "@/server/customer/auth";
import { hasTrustedOrigin, readJson, RequestTooLargeError } from "@/lib/security/request";
import { parse, v, ValidationError } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * مصادقة العملاء: /api/auth/register | /api/auth/login | /api/auth/logout
 * محمية بـ rate-limit ضد التخمين. تعتمد على قاعدة البيانات + argon2id + جلسات آمنة.
 */
export async function POST(req: Request, { params }: { params: Promise<{ action: string[] }> }) {
  if (!hasTrustedOrigin(req)) return NextResponse.json({ error: "invalid_request" }, { status: 403 });
  const { action } = await params;
  const which = action?.[0];
  const ip = clientKey(req);
  const ua = req.headers.get("user-agent") ?? undefined;

  if (!databaseConfigured()) {
    return NextResponse.json({ error: "not_configured", message: "Accounts are not available right now." }, { status: 503 });
  }

  if (which === "logout") {
    await logoutCustomer();
    return NextResponse.json({ ok: true });
  }

  if (!rateLimit(`auth:${which}:${ip}`, 8, 60_000).ok) {
    return NextResponse.json({ error: "rate_limited", message: "Too many attempts. Please wait a minute and try again." }, { status: 429 });
  }

  let body;
  try { body = parse(v.object({ email: v.email(), password: v.string({ min: 1, max: 256 }), name: v.optional(v.string({ min: 2, max: 120 })), locale: v.optional(v.literal("ar", "en")) }), await readJson(req, 8 * 1024)); }
  catch (error) { return NextResponse.json({ error: "bad_request", issues: error instanceof ValidationError ? error.issues : undefined }, { status: error instanceof RequestTooLargeError ? 413 : 400 }); }
  const { email, password } = body;

  if (which === "register") {
    const name = body.name ?? "";
    const locale = body.locale ?? "en";
    const result = await registerCustomer({ name, email, password, locale, ip, ua });
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  if (which === "login") {
    const result = await loginCustomer({ email, password, ip, ua });
    return NextResponse.json(result, { status: result.ok ? 200 : 401 });
  }

  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

export function GET() { return NextResponse.json({ error: "method_not_allowed" }, { status: 405 }); }
