import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { databaseConfigured } from "@/server/db";
import { registerCustomer, loginCustomer, logoutCustomer } from "@/server/customer/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * مصادقة العملاء: /api/auth/register | /api/auth/login | /api/auth/logout
 * محمية بـ rate-limit ضد التخمين. تعتمد على قاعدة البيانات + argon2id + جلسات آمنة.
 */
export async function POST(req: Request, { params }: { params: Promise<{ action: string[] }> }) {
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

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }

  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (which === "register") {
    const name = typeof body.name === "string" ? body.name : "";
    const locale = typeof body.locale === "string" ? body.locale : "en";
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