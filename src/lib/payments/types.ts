export const PAYMENT_STATUSES = ["pending","processing","paid","failed","cancelled","refunded","partially_refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ORDER_STATUSES = ["draft","pending_payment","confirmed","in_review","in_progress","completed","cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const SUBSCRIPTION_STATUSES = ["trialing","active","past_due","paused","cancelled","expired"] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export type ProviderId = "stripe" | "paypal" | "hyperpay" | "tap" | "myfatoorah" | "bank_transfer" | "mock";

/** Only these transitions are legal. `paid` is reachable only server-side. */
const T: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["processing","cancelled","failed"], processing: ["paid","failed","cancelled"],
  paid: ["refunded","partially_refunded"], failed: ["pending"], cancelled: [],
  refunded: [], partially_refunded: ["refunded"],
};
export const canTransition = (from: PaymentStatus, to: PaymentStatus) => T[from].includes(to);

export interface PaymentSession {
  provider: ProviderId; sessionId: string; redirectUrl: string | null;
  amountFils: number; currency: "JOD"; status: PaymentStatus;
}
export interface WebhookResult { eventId: string; provider: ProviderId; sessionId: string; paymentStatus: PaymentStatus; }

/** Every provider implements this. The UI never imports a provider directly. */
export interface PaymentProvider {
  readonly id: ProviderId;
  readonly supportsSubscriptions: boolean;
  readonly isOffline: boolean;
  createPaymentSession(i: { orderId: string; amountFils: number; currency: "JOD"; customerEmail: string; returnUrl: string; cancelUrl: string }): Promise<PaymentSession>;
  verifyPayment(sessionId: string): Promise<PaymentStatus>;
  cancelPayment(sessionId: string): Promise<PaymentStatus>;
  refundPayment(sessionId: string, amountFils?: number): Promise<PaymentStatus>;
  getPaymentStatus(sessionId: string): Promise<PaymentStatus>;
  /** Must throw on invalid signature — never a "probably fine". */
  verifyWebhook(rawBody: string, headers: Headers): Promise<WebhookResult>;
}
