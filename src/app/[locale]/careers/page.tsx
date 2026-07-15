import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";

export default async function CareersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");
  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="container-x section-sm"><div className="card mx-auto max-w-2xl p-10 text-center"><h2 className="t-card font-[family-name:--font-display]">{t("openTitle")}</h2><p className="mt-4 leading-relaxed text-[--color-text-muted]">{t("openBody")}</p><Link href="/contact" className="btn btn-primary btn-lg mt-8">{t("cta")}</Link></div></section>
    </>
  );
}
