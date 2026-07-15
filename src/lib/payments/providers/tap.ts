import type { PaymentProvider, PaymentStatus } from "../types";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * مزوّد Tap Payments (الأردن/الخليج).
 * Tap Payments provider. Talks to Tap's real API. Marks an order "paid" ONLY from
 * a signature-verified webhook — never from the browser redirect (anti-tamper).
 *
 * المفاتيح تُقرأ من البيئة (server فقط):
 *   TAP_SECRET_KEY       — المفتاح السري (sk_...)
 *   TAP_WEBHOOK_SECRET   — سر التحقق من الويبهوك
 */
const SECRET = process.env.TAP_SECRET_KEY ?? "";
const WEBHOOK_SECRET = process.env.TAP_WEBHOOK_SECRET ?? "";
const API = "https://api.tap.company/v2";

// Tap يتعامل بالوحدة الكبرى + كسور. JOD له 3 خانات عشرية، والـ fils عندنا /1000.
const filsToJod = (fils: number) => Number((fils / 1000).toFixed(3));

// خريطة حالات Tap → حالاتنا.
function mapStatus(tapStatus: string): PaymentStatus {
  switch (tapStatus?.toUpperCase()) {
    case "CAPTURED": case "AUTHORIZED": return "paid";
    case "INITIATED": case "IN_PROGRESS": return "processing";
    case "CANCELLED": case "VOID": return "cancelled";
    case "FAILED": case "DECLINED": case "ABANDONED": return "failed";
    default: return "pending";
  }
}

async function tapFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${SECRET}`, "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Tap API ${res.status}: ${await res.text()}`);
  return res.json();
}

export const tapProvider: PaymentProvider = {
  id: "tap", supportsSubscriptions: false, isOffline: false,

  async createPaymentSession({ orderId, amountFils, customerEmail, returnUrl }) {
    const charge = await tapFetch("/charges", {
      method: "POST",
      body: JSON.stringify({
        amount: filsToJod(amountFils), currency: "JOD",
        threeDSecure: true, save_card: false,
        customer: { email: customerEmail },
        source: { id: "src_all" }, // يعرض كل طرق الدفع المفعّلة بحساب Tap
        redirect: { url: returnUrl },
        reference: { order: orderId },
        metadata: { orderId },
      }),
    });
    return {
      provider: "tap", sessionId: charge.id,
      redirectUrl: charge.transaction?.url ?? null,
      amountFils, currency: "JOD", status: mapStatus(charge.status),
    };
  },

  async getPaymentStatus(sessionId) {
    const charge = await tapFetch(`/charges/${sessionId}`);
    return mapStatus(charge.status);
  },
  async verifyPayment(sessionId) {
    const charge = await tapFetch(`/charges/${sessionId}`);
    return mapStatus(charge.status);
  },
  async cancelPayment() { return "cancelled"; },
  async refundPayment(sessionId, amountFils) {
    const charge = await tapFetch(`/charges/${sessionId}`);
    await tapFetch("/refunds", { method: "POST", body: JSON.stringify({ charge_id: sessionId, amount: amountFils ? filsToJod(amountFils) : charge.amount, currency: "JOD", reason: "requested_by_customer" }) });
    return amountFils ? "partially_refunded" : "refunded";
  },

  // التحقق من توقيع الويبهوك — يرمي خطأ لو التوقيع غلط (أمان ضد التزوير).
  async verifyWebhook(rawBody, headers) {
    const signature = headers.get("hashstring") ?? headers.get("x-tap-signature") ?? "";
    if (!WEBHOOK_SECRET || !signature) throw new Error("Tap webhook signature missing.");
    const expected = createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
    const a = Buffer.from(expected), b = Buffer.from(signature);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("Tap webhook signature mismatch.");
    const event = JSON.parse(rawBody);
    return { eventId: event.id, provider: "tap", sessionId: event.id, paymentStatus: mapStatus(event.status) };
  },
};
