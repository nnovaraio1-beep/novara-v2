import { NextResponse } from "next/server";
import { parse, v, ValidationError } from "@/lib/validate";
import { resolveOrder } from "@/lib/commerce/catalog";
import { getProvider, onlinePaymentAvailable, manualPaymentEnabled } from "@/lib/payments/registry";
import { repository, newOrderNumber } from "@/server/repository";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { hasTrustedOrigin, readJson, RequestTooLargeError, siteOrigin } from "@/lib/security/request";
import { orderAccessToken } from "@/lib/security/order-access";
import { databaseConfigured } from "@/server/db";
import { POLICY_VERSION } from "@/data/legal";

export const runtime = "nodejs";

/** Create a checkout session. Body carries WHAT; server computes what it costs. */
const schema = v.object({
  email: v.email(), fullName: v.string({ min: 2, max: 120 }),
  company: v.optional(v.string({ max: 160 })), phone: v.optional(v.string({ max: 40 })),
  country: v.string({ min: 2, max: 60 }), city: v.string({ min: 1, max: 80 }),
  address: v.optional(v.string({ max: 240 })), taxNumber: v.optional(v.string({ max: 60 })),
  coupon: v.optional(v.string({ max: 40 })), notes: v.optional(v.string({ max: 2000 })),
  acceptTerms: v.literal("true"), acceptPrivacy: v.literal("true"),
  acceptRefund: v.literal("true"), acceptDelivery: v.literal("true"), policyVersion: v.literal(POLICY_VERSION),
  locale: v.literal("ar", "en"),
  paymentMethod: v.literal("online", "bank_transfer", "quotation"),
  lines: v.array(v.object({
    slug: v.string({ min: 1, max: 80 }), kind: v.literal("package", "service"),
    quantity: v.optional(v.int({ min: 1, max: 20 })), addons: v.optional(v.array(v.string({ max: 60 }), { max: 30 })),
  }), { max: 20 }),
});

export async function POST(req: Request) {
  if (!hasTrustedOrigin(req)) return NextResponse.json({ error: "invalid_request" }, { status: 403 });
  if (!databaseConfigured()) return NextResponse.json({ error: "checkout_unavailable" }, { status: 503 });
  const limit = rateLimit(`checkout:${clientKey(req)}`, 8, 60_000);
  if (!limit.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  let body;
  try { body = parse(schema, await readJson(req, 32 * 1024)); }
  catch (e) { return NextResponse.json({ error: "invalid", issues: e instanceof ValidationError ? e.issues : undefined }, { status: e instanceof RequestTooLargeError ? 413 : 400 }); }
  if (body.lines.length === 0) return NextResponse.json({ error: "empty_cart" }, { status: 400 });

  // Server is the only price authority.
  const resolved = resolveOrder(body.lines.map((l) => ({ slug: l.slug, kind: l.kind, quantity: l.quantity, addons: l.addons })), body.coupon);
  if (resolved.lines.length === 0) return NextResponse.json({ error: "no_valid_items" }, { status: 400 });

  const mustQuote = resolved.requiresQuote || body.paymentMethod === "quotation";
  if (!mustQuote && body.paymentMethod === "bank_transfer" && !manualPaymentEnabled()) return NextResponse.json({ error: "manual_disabled" }, { status: 409 });
  if (!mustQuote && body.paymentMethod === "online" && !onlinePaymentAvailable()) return NextResponse.json({ error: "online_payment_unavailable" }, { status: 503 });
  const configuredProvider = body.paymentMethod === "online" ? getProvider() : null;
  if (configuredProvider && resolved.hasSubscription && !configuredProvider.supportsSubscriptions) return NextResponse.json({ error: "subscription_payment_unavailable" }, { status: 409 });
  const order = await repository.createOrder({ orderNumber: newOrderNumber(), status: mustQuote ? "draft" : "pending_payment", email: body.email, resolved });
  await repository.audit({ actor: `guest:${body.email}`, action: "order.created", entity: "order", entityId: order.id, metadata: { totalFils: resolved.totalFils, mustQuote, consent: { terms: true, privacy: true, refund: true, delivery: true, policyVersion: body.policyVersion, recordedAt: new Date().toISOString() } } });
  const accessToken = orderAccessToken(order.orderNumber);

  if (mustQuote) return NextResponse.json({ orderNumber: order.orderNumber, accessToken, mode: "quotation" });

  if (body.paymentMethod === "bank_transfer") {
    await repository.createPayment({ orderId: order.id, provider: "bank_transfer", sessionId: `bank_${order.id}`, status: "pending", amountFils: resolved.totalFils });
    return NextResponse.json({ orderNumber: order.orderNumber, accessToken, mode: "bank_transfer" });
  }

  const provider = configuredProvider!;
  const origin = siteOrigin();
  let session;
  try {
    session = await provider.createPaymentSession({ orderId: order.id, amountFils: resolved.totalFils, currency: "JOD", customerEmail: body.email, returnUrl: `${origin}/${body.locale}/order/success?order=${encodeURIComponent(order.orderNumber)}&access=${encodeURIComponent(accessToken)}`, cancelUrl: `${origin}/${body.locale}/order/failed` });
  } catch {
    await repository.audit({ actor: `guest:${body.email}`, action: "payment.session_failed", entity: "order", entityId: order.id });
    return NextResponse.json({ error: "payment_session_failed" }, { status: 502 });
  }
  if (!session.redirectUrl || !session.redirectUrl.startsWith("https://")) return NextResponse.json({ error: "invalid_provider_response" }, { status: 502 });
  await repository.createPayment({ orderId: order.id, provider: provider.id, sessionId: session.sessionId, status: "pending", amountFils: resolved.totalFils });
  return NextResponse.json({ orderNumber: order.orderNumber, accessToken, mode: "online", provider: provider.id, redirectUrl: session.redirectUrl });
}
