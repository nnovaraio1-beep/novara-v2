import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { HYPERPAY_ORIGIN } from "./providers/hyperpay";

const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function hyperpayWidget(action: URL, sessionId: string, integrity: string, locale: "ar" | "en", label?: string) {
  const nonce = randomBytes(18).toString("base64");
  return new NextResponse(`<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>NOVARA — Test payment</title><body><h1>${locale === "ar" ? "دفع تجريبي فقط" : "Test payment only"}</h1>${label ? `<p>${escape(label)}</p>` : ""}<p>${locale === "ar" ? "استخدم بطاقة اختبار فقط. لا يوجد تجديد تلقائي." : "Use test cards only. No automatic renewals."}</p><form action="${escape(action.href)}" class="paymentWidgets" data-brands="VISA MASTER"></form><script nonce="${nonce}">var wpwlOptions = { paymentTarget: "_top" };</script><script nonce="${nonce}" src="${HYPERPAY_ORIGIN}/v1/paymentWidgets.js?checkoutId=${encodeURIComponent(sessionId)}" integrity="${escape(integrity)}" crossorigin="anonymous"></script><a href="${escape(action.href)}">${locale === "ar" ? "تحقق من حالة الدفع" : "Check payment status"}</a></body></html>`, {
    headers: {
      "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}' 'strict-dynamic'; style-src 'unsafe-inline' ${HYPERPAY_ORIGIN}; img-src data: ${HYPERPAY_ORIGIN}; connect-src ${HYPERPAY_ORIGIN}; frame-src ${HYPERPAY_ORIGIN}; form-action 'self' ${HYPERPAY_ORIGIN}; base-uri 'none'; frame-ancestors 'none'`,
    },
  });
}
