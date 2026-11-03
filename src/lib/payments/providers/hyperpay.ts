import type { HyperPayBillingDetails, PaymentProvider } from "../types";

// Deliberately not configurable: this implementation cannot contact live hosts.
export const HYPERPAY_ORIGIN = "https://eu-test.oppwa.com";
export function hyperpayConfigured() {
  return process.env.HYPERPAY_MODE === "test" && Boolean(process.env.HYPERPAY_ACCESS_TOKEN && process.env.HYPERPAY_ENTITY_ID);
}
export function amountJod(fils: number) {
  if (!Number.isSafeInteger(fils) || fils <= 0) throw new Error("Invalid amount");
  // Merchant test instructions and OPP API accept two decimal places.
  // Never silently round away fils: reject totals that cannot be represented.
  if (fils % 10 !== 0) throw new Error("JOD amount must be a whole hundredth");
  return `${Math.floor(fils / 1000)}.${String((fils % 1000) / 10).padStart(2, "0")}`;
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
    && typeof data.amount === "string" && /^\d+\.\d{2}$/.test(data.amount)
    && data.amount === (expected.amountFils % 10 === 0 ? amountJod(expected.amountFils) : "")
    && data.paymentType === "DB" && ["VISA", "MASTER"].includes(String(data.paymentBrand));
}

export function validateHyperPayBilling(billing: HyperPayBillingDetails): boolean {
  return billing.givenName.trim().length > 0 && billing.givenName.length <= 50 &&
    billing.surname.trim().length > 0 && billing.surname.length <= 50 &&
    billing.street1.trim().length > 0 && billing.street1.length <= 100 &&
    billing.city.trim().length > 0 && billing.city.length <= 80 &&
    billing.state.trim().length > 0 && billing.state.length <= 80 &&
    /^[A-Za-z0-9 -]{1,16}$/.test(billing.postcode) &&
    /^[A-Z]{2}$/.test(billing.country);
}

const unsupported = async (): Promise<never> => { throw new Error("Use bound server reconciliation; operation unsupported"); };
export const hyperpayProvider: PaymentProvider = {
  id: "hyperpay", supportsSubscriptions: false, isOffline: false,
  async createPaymentSession(input) {
    const billing = input.billing;
    if (!billing || !validateHyperPayBilling(billing)) throw new Error("Valid 3DS2 billing details required");
    const data = await hyperpayRequest("/v1/checkouts", new URLSearchParams({
      amount: amountJod(input.amountFils), currency: input.currency, paymentType: "DB",
      merchantTransactionId: input.orderId, "customer.email": input.customerEmail,
      "customer.givenName": billing.givenName, "customer.surname": billing.surname,
      "billing.street1": billing.street1, "billing.city": billing.city,
      "billing.state": billing.state, "billing.postcode": billing.postcode,
      "billing.country": billing.country,
      testMode: "EXTERNAL", "customParameters[3DS2_enrolled]": "true",
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
