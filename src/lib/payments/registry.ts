import type { PaymentProvider, ProviderId } from "./types";
import { bankTransferProvider } from "./providers/bank-transfer";

/**
 * Provider resolution, and the rule that matters: if no real online provider is
 * configured, we do NOT render a card form. A checkout that looks like it
 * charges but does nothing is worse than none. In that state the site offers
 * bank transfer and quotation — both honest about what happens next.
 *
 * Real gateways (Stripe/PayPal/HyperPay/Tap/MyFatoorah) need their vendor SDKs,
 * which aren't installed. Each is therefore ABSENT from IMPLEMENTED, so
 * `onlinePaymentAvailable()` returns false and the UI degrades honestly.
 */
const CONFIGURED = (process.env.PAYMENT_PROVIDER ?? "") as ProviderId | "";

const IMPLEMENTED: Partial<Record<ProviderId, () => PaymentProvider>> = {
  bank_transfer: () => bankTransferProvider,
  // stripe:     () => stripeProvider,     // needs `stripe`         (see .env.example)
  // paypal:     () => paypalProvider,     // needs `@paypal/*`
  // hyperpay:   () => hyperpayProvider,
  // tap: () => tapProvider,
  // myfatoorah: () => myfatoorayProvider,
};

export function getProvider(): PaymentProvider | null {
  if (!CONFIGURED) return null;
  const f = IMPLEMENTED[CONFIGURED];
  if (!f) { console.error(`[payments] PAYMENT_PROVIDER="${CONFIGURED}" not implemented — online payment disabled.`); return null; }
  return f();
}
export function getProviderById(id: string): PaymentProvider | null {
  const f = IMPLEMENTED[id as ProviderId]; return f ? f() : null;
}
/** Drives the checkout UI. False → render manual/quote, never a dead card form. */
export function onlinePaymentAvailable(): boolean {
  const p = getProvider(); return Boolean(p) && !p!.isOffline;
}
export const manualPaymentEnabled = () => process.env.ENABLE_BANK_TRANSFER === "true";
