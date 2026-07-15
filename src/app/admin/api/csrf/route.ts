import { NextResponse } from "next/server";
import { getSessionContext } from "@/server/admin/session";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Returns the current session's CSRF token to the authenticated admin only. */
export async function GET() {
  const ctx = await getSessionContext();
  if (!ctx) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  return NextResponse.json({ csrf: ctx.csrfToken });
}
