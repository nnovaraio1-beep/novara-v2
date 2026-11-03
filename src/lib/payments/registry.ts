import type { PaymentProvider, ProviderId } from "./types";
import { hyperpayProvider, hyperpayConfigured } from "./providers/hyperpay";
import { bankTransferProvider } from "./providers/bank-transfer";

/**
 * Provider resolution, and the rule that matters: if no real online provider is
 * configured, we do NOT render a card form. A checkout that looks like it
 * charges but does nothing is worse than none. In that state the site offers
 * bank transfer and quotation — both honest about what happens next.
 *
 * HyperPay requires explicit test configuration. Other online providers remain
 * disabled until implemented.
 */
const CONFIGURED = (process.env.PAYMENT_PROVIDER ?? "") as ProviderId | "";

const IMPLEMENTED: Partial<Record<ProviderId, () => PaymentProvider>> = {
  bank_transfer: () => bankTransferProvider,
  // stripe:     () => stripeProvider,     // needs `stripe`         (see .env.example)
  // paypal:     () => paypalProvider,     // needs `@paypal/*`
  hyperpay: () => hyperpayProvider,
  // tap: () => tapProvider,
  // myfatoorah: () => myfatoorayProvider,
};

export function getProvider(): PaymentProvider | null {
  if (!CONFIGURED || (CONFIGURED === "hyperpay" && !hyperpayConfigured())) return null;
  const f = IMPLEMENTED[CONFIGURED];
  if (!f) { console.error(`[payments] PAYMENT_PROVIDER="${CONFIGURED}" not implemented — online payment disabled.`); return null; }
  return f();
}
export function getProviderById(id: string): PaymentProvider | null {
  if (id === "hyperpay" && !hyperpayConfigured()) return null;
  const f = IMPLEMENTED[id as ProviderId]; return f ? f() : null;
}
/** Drives the checkout UI. False → render manual/quote, never a dead card form. */
export function onlinePaymentAvailable(): boolean {
  const p = getProvider(); return Boolean(p) && !p!.isOffline;
}
export const manualPaymentEnabled = () => process.env.ENABLE_BANK_TRANSFER === "true";
