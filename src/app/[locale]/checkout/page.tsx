import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CheckoutFlow } from "@/components/checkout-flow";
import { onlinePaymentAvailable, manualPaymentEnabled } from "@/lib/payments/registry";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Availability decided on the SERVER; the browser never guesses whether a gateway exists.
  return <CheckoutFlow onlineAvailable={onlinePaymentAvailable()} manualAvailable={manualPaymentEnabled()} />;
}
