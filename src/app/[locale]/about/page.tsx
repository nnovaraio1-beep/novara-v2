import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "about", "about");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="container-x section-sm">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal><h2 className="t-card font-[family-name:--font-display]">{t("storyTitle")}</h2><p className="mt-5 leading-relaxed text-[--color-text-muted]">{t("storyA")}</p><p className="mt-4 leading-relaxed text-[--color-text-muted]">{t("storyB")}</p></Reveal>
          <Reveal delay={0.08}><div className="grid gap-6 sm:grid-cols-2">{(["approach", "bilingual", "measured", "ownership"] as const).map((k) => (<div key={k} className="card p-7"><h3 className="text-[17px] font-bold">{t(`values.${k}.title`)}</h3><p className="mt-2.5 text-[14px] leading-relaxed text-[--color-text-muted]">{t(`values.${k}.body`)}</p></div>))}</div></Reveal>
        </div>
      </section>
      <section className="section-light section"><div className="container-x text-center"><h2 className="t-section font-[family-name:--font-display] text-[--color-ink]">{t("ctaTitle")}</h2><Link href="/contact" className="btn btn-primary btn-lg group mt-8">{t("ctaButton")}<ArrowRight className="flip-rtl size-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link></div></section>
    </>
  );
}
