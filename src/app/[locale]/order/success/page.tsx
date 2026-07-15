import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { OrderStatusView } from "@/components/order-status";

export default async function OrderSuccessPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<{ order?: string; mode?: string }> }) {
  const { locale } = await params; const { order, mode } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("orderSuccess");
  return (<div className="container-x section"><div className="mx-auto max-w-2xl"><h1 className="t-section font-[family-name:--font-display]">{t("title")}</h1><p className="t-body mt-5 text-[--color-text-muted]">{t("lead")}</p><OrderStatusView orderNumber={order ?? null} mode={mode ?? null} /></div></div>);
}
