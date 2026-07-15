import { NextResponse } from "next/server";
import { databaseConfigured } from "@/server/db";
import { updateCustomerProfile } from "@/server/customer/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!databaseConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : undefined);
  const result = await updateCustomerProfile({ name: str("name"), phone: str("phone"), company: str("company"), taxNumber: str("taxNumber") });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
