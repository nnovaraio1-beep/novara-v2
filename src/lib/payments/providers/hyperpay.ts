import type { PaymentProvider } from "../types";

// Deliberately not configurable: this implementation cannot contact live hosts.
export const HYPERPAY_ORIGIN = "https://eu-test.oppwa.com";
export function hyperpayConfigured() {
  return process.env.HYPERPAY_MODE === "test" && Boolean(process.env.HYPERPAY_ACCESS_TOKEN && process.env.HYPERPAY_ENTITY_ID);
}
export function amountJod(fils: number) {
  if (!Number.isSafeInteger(fils) || fils <= 0) throw new Error("Invalid amount");
  return `${Math.floor(fils / 1000)}.${String(fils % 1000).padStart(3, "0")}`;
}
export async function hyperpayRequest(path: string, body?: URLSearchParams) {
  if (!hyperpayConfigured()) throw new Error("HyperPay test configuration required");
  const url = new URL(path, HYPERPAY_ORIGIN);
  if (url.origin !== HYPERPAY_ORIGIN) throw new Error("Invalid gateway origin");
  if (body) body.set("entityId", process.env.HYPERPAY_ENTITY_ID!);
  else url.searchParams.set("entityId", process.env.HYPERPAY_ENTITY_ID!);
  const response = await fetch(url, {
    method: body ? "POST" : "GET", body,
    headers: { Authorization: `Bearer ${process.env.HYPERPAY_ACCESS_TOKEN}` },
    cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Gateway request failed");
  return response.json();
}

export function verifiedDebit(data: Record<string, unknown>, expected: { orderId: string; amountFils: number; currency: string }) {
  const result = data.result as { code?: string } | undefined;
  // Strict allowlist: pending, review, registration and authorization are not paid.
  const paid = ["000.000.000", "000.100.110", "000.100.111", "000.100.112"].includes(result?.code ?? "");
  return paid && typeof data.id === "string" && /^[A-Za-z0-9.-]{1,200}$/.test(data.id)
    && data.merchantTransactionId === expected.orderId && data.currency === expected.currency
    && typeof data.amount === "string" && /^\d+\.\d{2,3}$/.test(data.amount)
    && `${data.amount.split(".")[0]}.${data.amount.split(".")[1].padEnd(3, "0")}` === amountJod(expected.amountFils)
    && data.paymentType === "DB" && ["VISA", "MASTER"].includes(String(data.paymentBrand));
}

const unsupported = async (): Promise<never> => { throw new Error("Use bound server reconciliation; operation unsupported"); };
export const hyperpayProvider: PaymentProvider = {
  id: "hyperpay", supportsSubscriptions: false, isOffline: false,
  async createPaymentSession(input) {
    const data = await hyperpayRequest("/v1/checkouts", new URLSearchParams({
      amount: amountJod(input.amountFils), currency: input.currency, paymentType: "DB",
      merchantTransactionId: input.orderId, "customer.email": input.customerEmail,
      integrity: "true",
    }));
    if (typeof data.id !== "string" || !/^[A-Za-z0-9.-]{1,200}$/.test(data.id)) throw new Error("Invalid checkout");
    const url = new URL("/api/payments/hyperpay", input.returnUrl);
    const returnUrl = new URL(input.returnUrl);
    url.search = returnUrl.search;
    url.searchParams.set("session", data.id);
    url.searchParams.set("locale", returnUrl.pathname.startsWith("/ar/") ? "ar" : "en");
    if (typeof data.integrity !== "string" || !/^sha(256|384|512)-[A-Za-z0-9+/=]+$/.test(data.integrity)) throw new Error("Missing widget integrity");
    return { integrity: data.integrity, provider: "hyperpay", sessionId: data.id, redirectUrl: url.href, amountFils: input.amountFils, currency: "JOD", status: "pending" };
  },
  verifyPayment: unsupported, getPaymentStatus: unsupported, cancelPayment: unsupported,
  refundPayment: unsupported, verifyWebhook: unsupported,
};
