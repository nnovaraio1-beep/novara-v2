import { NextResponse } from "next/server";
import { parse, v, ValidationError } from "@/lib/validate";
import { resolveOrder } from "@/lib/commerce/catalog";
import { getProvider, onlinePaymentAvailable, manualPaymentEnabled } from "@/lib/payments/registry";
import { repository, newOrderNumber } from "@/server/repository";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Create a checkout session. Body carries WHAT; server computes what it costs. */
const schema = v.object({
  email: v.email(), fullName: v.string({ min: 2, max: 120 }),
  company: v.optional(v.string({ max: 160 })), phone: v.optional(v.string({ max: 40 })),
  country: v.string({ min: 2, max: 60 }), city: v.string({ min: 1, max: 80 }),
  address: v.optional(v.string({ max: 240 })), taxNumber: v.optional(v.string({ max: 60 })),
  coupon: v.optional(v.string({ max: 40 })), notes: v.optional(v.string({ max: 2000 })),
  acceptTerms: v.literal("true"), acceptPrivacy: v.literal("true"),
  paymentMethod: v.literal("online", "bank_transfer", "quotation"),
  lines: v.array(v.object({
    slug: v.string({ min: 1, max: 80 }), kind: v.literal("package", "service"),
    quantity: v.optional(v.int({ min: 1, max: 20 })), addons: v.optional(v.array(v.string({ max: 60 }), { max: 30 })),
  }), { max: 20 }),
});

export async function POST(req: Request) {
  const limit = rateLimit(`checkout:${clientKey(req)}`, 8, 60_000);
  if (!limit.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  let body;
  try { body = parse(schema, await req.json()); }
  catch (e) { return NextResponse.json({ error: "invalid", issues: e instanceof ValidationError ? e.issues : undefined }, { status: 400 }); }
  if (body.lines.length === 0) return NextResponse.json({ error: "empty_cart" }, { status: 400 });

  // Server is the only price authority.
  const resolved = resolveOrder(body.lines.map((l) => ({ slug: l.slug, kind: l.kind, quantity: l.quantity, addons: l.addons })), body.coupon);
  if (resolved.lines.length === 0) return NextResponse.json({ error: "no_valid_items" }, { status: 400 });

  const mustQuote = resolved.requiresQuote || body.paymentMethod === "quotation";
  const order = await repository.createOrder({ orderNumber: newOrderNumber(), status: mustQuote ? "draft" : "pending_payment", email: body.email, resolved });
  await repository.audit({ actor: `guest:${body.email}`, action: "order.created", entity: "order", entityId: order.id, metadata: { totalFils: resolved.totalFils, mustQuote } });

  if (mustQuote) return NextResponse.json({ orderNumber: order.orderNumber, mode: "quotation" });

  if (body.paymentMethod === "bank_transfer") {
    if (!manualPaymentEnabled()) return NextResponse.json({ error: "manual_disabled" }, { status: 409 });
    return NextResponse.json({ orderNumber: order.orderNumber, mode: "bank_transfer" });
  }

  // Online: refuse rather than render a dead form.
  if (!onlinePaymentAvailable()) return NextResponse.json({ error: "online_payment_unavailable", orderNumber: order.orderNumber }, { status: 503 });

  const provider = getProvider()!;
  const origin = new URL(req.url).origin;
  const session = await provider.createPaymentSession({ orderId: order.id, amountFils: resolved.totalFils, currency: "JOD", customerEmail: body.email, returnUrl: `${origin}/order/success`, cancelUrl: `${origin}/order/failed` });
  await repository.createPayment({ orderId: order.id, provider: provider.id, sessionId: session.sessionId, status: "pending", amountFils: resolved.totalFils });
  return NextResponse.json({ orderNumber: order.orderNumber, mode: "online", provider: provider.id, redirectUrl: session.redirectUrl });
}
