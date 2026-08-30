import { NextResponse } from "next/server";
import { databaseConfigured } from "@/server/db";
import { updateCustomerProfile } from "@/server/customer/auth";
import { hasTrustedOrigin, readJson, RequestTooLargeError } from "@/lib/security/request";
import { parse, v, ValidationError } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasTrustedOrigin(req)) return NextResponse.json({ error: "invalid_request" }, { status: 403 });
  if (!databaseConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  let body;
  try { body = parse(v.object({ name: v.optional(v.string({ min: 2, max: 120 })), phone: v.optional(v.string({ max: 40 })), company: v.optional(v.string({ max: 160 })), taxNumber: v.optional(v.string({ max: 60 })) }), await readJson(req, 8 * 1024)); }
  catch (error) { return NextResponse.json({ error: "bad_request", issues: error instanceof ValidationError ? error.issues : undefined }, { status: error instanceof RequestTooLargeError ? 413 : 400 }); }
  const result = await updateCustomerProfile(body);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
