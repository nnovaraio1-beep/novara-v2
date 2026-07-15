import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check, Clock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { Reveal } from "@/components/reveal";
import { SERVICES, SERVICE_GROUPS, groupTitles } from "@/data/services";
import { ServicePrice, PromoBanner } from "@/components/service-price";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "services", "services");
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const ar = locale === "ar";

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <div className="container-x pb-28">
        <PromoBanner locale={locale} />
        {SERVICE_GROUPS.map((group, gi) => {
          const rows = SERVICES.filter((s) => s.group === group);
          if (rows.length === 0) return null;
          const g = groupTitles[group];
          return (
            <section key={group} id={group} className={`scroll-mt-28 ${gi > 0 ? "mt-24" : "mt-16"}`}>
              <Reveal className="max-w-3xl">
                <h2 className="t-section font-[family-name:--font-display]">{ar ? g.ar : g.en}</h2>
                <p className="t-body mt-4 text-[--color-text-muted]">{ar ? g.intro_ar : g.intro_en}</p>
              </Reveal>
              {rows.length === 1 ? (
                <div className="mt-10">
                  <article className="card grid overflow-hidden lg:grid-cols-2">
                    <div className="ratio-4-3 relative lg:aspect-auto"><Image src={rows[0].image} alt={ar ? rows[0].titleAr : rows[0].titleEn} fill sizes="(max-width:1024px) 100vw, 680px" loading="lazy" className="object-cover" /></div>
                    <div className="flex flex-col justify-center p-8 lg:p-12">
                      <h3 className="t-card font-[family-name:--font-display]">{ar ? rows[0].titleAr : rows[0].titleEn}</h3>
                      <p className="mt-4 leading-relaxed text-[--color-text-muted]">{ar ? rows[0].valueAr : rows[0].valueEn}</p>
                      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                        {(ar ? rows[0].featuresAr : rows[0].featuresEn).slice(0, 4).map((f) => (<li key={f} className="flex items-start gap-2.5 text-[14px] text-[--color-text-muted]"><Check className="mt-1 size-3.5 shrink-0 text-[--color-brand-light]" aria-hidden />{f}</li>))}
                      </ul>
                      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[--border-hairline] pt-6">
                        <div><p className="t-label text-[--color-text-dim]">{t("from")}</p><ServicePrice price={rows[0].price} billing={rows[0].billingType} locale={locale} size={22} /></div>
                        <p className="flex items-center gap-1.5 text-[13px] text-[--color-text-dim]"><Clock className="size-3.5" aria-hidden />{ar ? rows[0].timelineAr : rows[0].timelineEn}</p>
                        <Link href={`/services/${rows[0].slug}`} className="btn btn-ghost group ms-auto p-0">{t("viewDetails")}<ArrowRight className="flip-rtl size-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link>
                      </div>
                    </div>
                  </article>
                </div>
              ) : (
                <div className={`mt-10 grid items-stretch gap-6 ${rows.length >= 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}>
                  {rows.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
