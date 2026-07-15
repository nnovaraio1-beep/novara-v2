import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { XCircle } from "lucide-react";

export default async function OrderFailedPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("orderFailed");
  return (<div className="container-x section"><div className="mx-auto max-w-2xl text-center"><XCircle className="mx-auto size-12 text-red-400" aria-hidden /><h1 className="t-section mt-8 font-[family-name:--font-display]">{t("title")}</h1><p className="t-body mt-5 text-[--color-text-muted]">{t("lead")}</p><p className="mt-4 text-[15px] text-[--color-text-dim]">{t("noCharge")}</p><div className="mt-10 flex flex-wrap justify-center gap-4"><Link href="/checkout" className="btn btn-primary btn-lg">{t("retry")}</Link><Link href="/contact" className="btn btn-secondary btn-lg">{t("contact")}</Link></div></div></div>);
}
