import { NextResponse } from "next/server";
import { repository } from "@/server/repository";
import { rateLimit, clientKey } from "@/lib/rate-limit";
export const runtime = "nodejs";

/** Order status for the confirmation page. `paid` is never inferred here — set only by a verified webhook.
 *  ⚠️ Authorization gap (documented): knowing an order number should not equal reading it; add a signed token before production. */
export async function GET(req: Request, { params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  if (!rateLimit(`order:${clientKey(req)}`, 30, 60_000).ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const order = await repository.getOrderByNumber(number);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({
    orderNumber: order.orderNumber, status: order.status, paymentConfirmed: order.status === "confirmed",
    totalFils: order.resolved.totalFils, currency: order.resolved.currency, requiresQuote: order.resolved.requiresQuote,
    lines: order.resolved.lines.map((l) => ({ name: l.name, quantity: l.quantity, billing: l.billing })),
  });
}
