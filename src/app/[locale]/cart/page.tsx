import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { NOINDEX_METADATA } from "@/lib/seo";
import { PageHeader } from "@/components/page-header";
import { CartView } from "@/components/cart-view";

export const metadata = NOINDEX_METADATA;

export default async function CartPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");
  return (<><PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} /><section className="container-x pb-28 pt-4"><CartView /></section></>);
}
