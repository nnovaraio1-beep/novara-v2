import { NextResponse } from "next/server";
import { hyperpayWidget } from "@/lib/payments/hyperpay-widget";
import { requireDb } from "@/server/db";
import { validOrderAccess } from "@/lib/security/order-access";
import { hyperpayConfigured, hyperpayRequest, verifiedDebit } from "@/lib/payments/providers/hyperpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!hyperpayConfigured()) return new NextResponse("Test payment unavailable", { status: 503 });
  const url = new URL(req.url);
  const number = url.searchParams.get("order") ?? "";
  if (!validOrderAccess(number, url.searchParams.get("access"))) return new NextResponse("Forbidden", { status: 403 });
  const sessionId = url.searchParams.get("session") ?? "";
  if (!/^[A-Za-z0-9.-]{1,200}$/.test(sessionId)) return new NextResponse("Invalid checkout", { status: 400 });
  const db = requireDb();
  const payment = await db.payment.findUnique({ where: { provider_sessionId: { provider: "hyperpay", sessionId } }, include: { order: { include: { items: true } } } });
  if (!payment || payment.order.orderNumber !== number) return new NextResponse("Not found", { status: 404 });
  const locale = url.searchParams.get("locale") === "ar" ? "ar" : "en";
  const resultUrl = new URL(`/${locale}/order/success`, url);
  resultUrl.search = new URLSearchParams({ order: number, access: url.searchParams.get("access")!, mode: "online" }).toString();
  if (payment.status === "paid") return NextResponse.redirect(resultUrl);
  if (payment.status !== "processing" || payment.order.status !== "pending_payment" || payment.order.items.some(i => i.billingType !== "once")) return new NextResponse("Checkout unavailable", { status: 409 });

  if (url.searchParams.has("verify") || url.searchParams.has("resourcePath")) {
    // Ignore resourcePath and all claimed result fields. Only the persisted session
    // selects the fixed API path. A DB lease enforces the gateway's 2/minute limit.
    const leased = await db.payment.updateMany({ where: { id: payment.id, status: "processing", OR: [{ lastVerifiedAt: null }, { lastVerifiedAt: { lt: new Date(Date.now() - 31000) } }] }, data: { lastVerifiedAt: new Date() } });
    if (!leased.count) return new NextResponse("Verification pending. Retry after 31 seconds.", { status: 429, headers: { "Retry-After": "31", "Cache-Control": "no-store" } });
    try {
      const data = await hyperpayRequest(`/v1/checkouts/${encodeURIComponent(sessionId)}/payment`, undefined, payment.order.currency === "USD" ? "USD" : "JOD");
      if (payment.amountFils !== payment.order.totalFils || !verifiedDebit(data, { orderId: payment.orderId, amountFils: payment.amountFils, currency: payment.order.currency })) {
        return new NextResponse("Payment not verified. Your order remains pending. Use your order link to check its status.", { status: 409, headers: { "Cache-Control": "no-store" } });
      }
      await db.$transaction(async tx => {
        const claimed = await tx.payment.updateMany({ where: { id: payment.id, status: "processing" }, data: { status: "paid", providerReference: data.id } });
        if (!claimed.count) return;
        const order = await tx.order.updateMany({ where: { id: payment.orderId, status: "pending_payment", totalFils: payment.amountFils, currency: payment.order.currency }, data: { status: "confirmed" } });
        if (!order.count) throw new Error("Order no longer payable");
        await tx.auditLog.create({ data: { action: "hyperpay.test_order_confirmed", entityType: "order", entityId: payment.orderId, after: { paymentId: payment.id, providerReference: data.id } } });
      });
      return NextResponse.redirect(resultUrl);
    } catch {
      return new NextResponse("Verification unavailable. Order remains pending; do not pay again. Retry after 31 seconds or contact support.", { status: 502, headers: { "Cache-Control": "no-store" } });
    }
  }
  if (!payment.checkoutIntegrity || !/^sha(256|384|512)-[A-Za-z0-9+/=]+$/.test(payment.checkoutIntegrity)) return new NextResponse("Widget integrity unavailable", { status: 409 });
  const action = new URL(url); action.searchParams.set("verify", "1");
  return hyperpayWidget(action, sessionId, payment.checkoutIntegrity, locale);
}
