import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/page-header";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="container-x section-sm"><div className="mx-auto max-w-3xl space-y-8">{(["a", "b", "c", "d"] as const).map((k) => (<div key={k}><h2 className="text-[19px] font-bold">{t(`s.${k}.h`)}</h2><p className="mt-3 leading-relaxed text-[--color-text-muted]">{t(`s.${k}.p`)}</p></div>))}<p className="border-t border-[--border-hairline] pt-8 text-[13px] text-[--color-text-dim]">{t("updated")}</p></div></section>
    </>
  );
}
