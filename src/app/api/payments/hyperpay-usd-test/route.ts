import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { hyperpayWidget } from "@/lib/payments/hyperpay-widget";
import { hyperpayProvider, hyperpayRequest, hyperpayUsdTestConfigured, USD_SANDBOX_ORIGIN, verifiedDebit } from "@/lib/payments/providers/hyperpay";
import { db } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const amountCents = 100;
const currency = "USD";
const path = "/api/payments/hyperpay-usd-test";
const privateHeaders = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };

function page(message: string, status = 200, content = "") {
  return new NextResponse(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NOVARA USD sandbox</title><main><h1>NOVARA USD sandbox</h1><p>${message}</p>${content}</main></html>`, {
    status,
    headers: {
      ...privateHeaders,
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
}

function equalSecret(provided: string, expected: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(provided), digest(expected));
}

function access(id: string) {
  return createHmac("sha256", process.env.HYPERPAY_USD_TEST_KEY!).update(`usd-checkout:${id}`).digest("hex");
}

export async function POST(req: Request) {
  // Netlify may rewrite the internal request origin. The deployment config
  // selects the site; the browser Origin protects the checkout-creation POST.
  if (process.env.NEXT_PUBLIC_SITE_URL !== USD_SANDBOX_ORIGIN) return new NextResponse(null, { status: 404 });
  if (!hyperpayUsdTestConfigured() || !db) return page("USD sandbox setup is incomplete.", 503);
  if (req.headers.get("origin") !== USD_SANDBOX_ORIGIN) return page("Forbidden.", 403);

  const body = await req.formData().catch(() => null);
  const key = body?.get("key");
  if (typeof key !== "string" || !equalSecret(key, process.env.HYPERPAY_USD_TEST_KEY!)) return page("Forbidden.", 403);

  const attempt = await db.hyperPayUsdTest.create({ data: { amountCents, currency } });
  const callback = new URL(path, USD_SANDBOX_ORIGIN);
  callback.searchParams.set("attempt", attempt.id);
  callback.searchParams.set("access", access(attempt.id));
  try {
    const session = await hyperpayProvider.createPaymentSession({
      orderId: attempt.id,
      // The existing provider uses thousandths of a major unit. USD persistence uses cents.
      amountFils: attempt.amountCents * 10,
      currency,
      customerEmail: "sandbox@example.com",
      billing: { givenName: "Sandbox", surname: "Tester", street1: "123 Test Street", city: "Amman", state: "Amman", postcode: "11118", country: "JO" },
      returnUrl: callback.href,
      cancelUrl: callback.href,
    });
    await db.hyperPayUsdTest.update({
      where: { id: attempt.id },
      data: { sessionId: session.sessionId, checkoutIntegrity: session.integrity, status: "pending" },
    });
    return NextResponse.redirect(callback, { status: 303, headers: privateHeaders });
  } catch {
    await db.hyperPayUsdTest.update({ where: { id: attempt.id }, data: { status: "checkout_error" } });
    return page("HyperPay did not open the checkout. Ask the sandbox administrator to check the configuration.", 502);
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (process.env.NEXT_PUBLIC_SITE_URL !== USD_SANDBOX_ORIGIN) return new NextResponse(null, { status: 404 });
  if (!hyperpayUsdTestConfigured() || !db) return page("USD sandbox setup is incomplete.", 503);

  const id = url.searchParams.get("attempt");
  if (!id) {
    return page("Fixed amount: 1.00 USD. Use a HyperPay sandbox card. This test is independent of the NOVARA store.", 200,
      `<form method="post" action="${path}"><label>Sandbox access key <input type="password" name="key" required autocomplete="off"></label> <button>Open sandbox checkout</button></form>`);
  }
  if (!/^[a-f0-9-]{36}$/.test(id) || !equalSecret(url.searchParams.get("access") ?? "", access(id))) {
    return page("Forbidden.", 403);
  }

  const attempt = await db.hyperPayUsdTest.findUnique({ where: { id } });
  if (!attempt || attempt.currency !== currency || attempt.amountCents !== amountCents || !attempt.sessionId || !attempt.checkoutIntegrity) {
    return page("Sandbox checkout unavailable.", 404);
  }
  if (attempt.status === "paid") return page("HyperPay confirmed the 1.00 USD sandbox debit.");

  const callback = new URL(path, USD_SANDBOX_ORIGIN);
  callback.searchParams.set("attempt", id);
  callback.searchParams.set("access", access(id));
  callback.searchParams.set("verify", "1");
  if (!url.searchParams.has("verify") && !url.searchParams.has("resourcePath")) {
    return hyperpayWidget(callback, attempt.sessionId, attempt.checkoutIntegrity, "en", "1.00 USD");
  }

  const retry = `<a href="${callback.href.replaceAll("&", "&amp;")}">Check the existing payment</a>`;
  const now = new Date();
  const lease = await db.hyperPayUsdTest.updateMany({
    where: { id, status: "pending", OR: [{ lastVerifiedAt: null }, { lastVerifiedAt: { lt: new Date(now.getTime() - 31000) } }] },
    data: { lastVerifiedAt: now },
  });
  if (!lease.count) return page("Verification is pending. Wait 31 seconds before checking again.", 429, retry);

  try {
    const data = await hyperpayRequest(`/v1/checkouts/${encodeURIComponent(attempt.sessionId)}/payment`, undefined, currency);
    const code = data.result?.code;
    const resultCode = typeof code === "string" && /^\d{3}\.\d{3}\.\d{3}$/.test(code) ? code : null;
    const paymentBrand = data.paymentBrand === "VISA" || data.paymentBrand === "MASTER" ? data.paymentBrand : null;
    const paid = verifiedDebit(data, { orderId: id, amountFils: attempt.amountCents * 10, currency });
    const updated = await db.hyperPayUsdTest.updateMany({
      where: { id, status: "pending", lastVerifiedAt: now },
      data: { resultCode, paymentBrand, ...(paid ? { status: "paid", providerReference: data.id } : {}) },
    });
    if (paid && updated.count) return page("HyperPay confirmed the 1.00 USD sandbox debit.");
    return page(resultCode ? `Payment not confirmed. HyperPay result: ${resultCode}.` : "Payment not confirmed.", 409, retry);
  } catch {
    return page("Verification unavailable. Check the existing payment after 31 seconds.", 502, retry);
  }
}
