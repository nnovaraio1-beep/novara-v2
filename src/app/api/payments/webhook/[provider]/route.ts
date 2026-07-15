import { NextResponse } from "next/server";
import { getProviderById } from "@/lib/payments/registry";
import { repository } from "@/server/repository";
import { canTransition, type OrderStatus } from "@/lib/payments/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The ONLY place an order becomes paid. A browser landing on /order/success proves nothing. */
export async function POST(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider: providerId } = await params;
  const provider = getProviderById(providerId);
  if (!provider) return NextResponse.json({ error: "unknown_provider" }, { status: 404 });

  const rawBody = await req.text(); // raw body BEFORE parse — signature integrity
  let event;
  try { event = await provider.verifyWebhook(rawBody, req.headers); }
  catch (err) { await repository.audit({ actor: `webhook:${providerId}`, action: "webhook.signature_invalid", entity: "payment", entityId: "unknown", metadata: { message: (err as Error).message } }); return NextResponse.json({ error: "invalid_signature" }, { status: 401 }); }

  if (!(await repository.recordEventOnce(event.provider, event.eventId))) return NextResponse.json({ ok: true, deduplicated: true });

  const payment = await repository.getPaymentBySession(event.provider, event.sessionId);
  if (!payment) return NextResponse.json({ error: "unknown_session" }, { status: 404 });
  if (!canTransition(payment.status, event.paymentStatus)) { await repository.audit({ actor: `webhook:${providerId}`, action: "payment.illegal_transition", entity: "payment", entityId: payment.id, metadata: { from: payment.status, to: event.paymentStatus } }); return NextResponse.json({ ok: true, ignored: true }); }

  await repository.setPaymentStatus(payment.id, event.paymentStatus);
  const next: Partial<Record<string, OrderStatus>> = { paid: "confirmed", failed: "pending_payment", cancelled: "cancelled", refunded: "cancelled" };
  const ns = next[event.paymentStatus];
  if (ns) await repository.setOrderStatus(payment.orderId, ns);
  if (event.paymentStatus === "paid") await repository.audit({ actor: `webhook:${providerId}`, action: "order.confirmed", entity: "order", entityId: payment.orderId });
  return NextResponse.json({ ok: true });
}
export function GET() { return NextResponse.json({ error: "method_not_allowed" }, { status: 405 }); }
