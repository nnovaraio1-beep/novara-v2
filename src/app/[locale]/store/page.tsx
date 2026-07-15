import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PackageCard } from "@/components/package-card";
import { Reveal } from "@/components/reveal";
import { CATEGORIES, categoryTitle, categoryIntro } from "@/data/categories";
import { packagesByCategory, pkgTitle, pkgBestFor, pkgFeatures } from "@/data/packages";
import { formatPrice } from "@/lib/pricing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "store", "store");
}

export default async function StorePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("store");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <div className="container-x pb-28">
        {CATEGORIES.map((cat, ci) => {
          const rows = packagesByCategory(cat.key);
          if (rows.length === 0) return null;
          return (
            <section key={cat.key} id={cat.key} className={`scroll-mt-28 ${ci > 0 ? "mt-24" : "mt-16"}`}>
              <Reveal className="max-w-3xl">
                <h2 className="t-section font-[family-name:--font-display]">{categoryTitle(cat, locale)}</h2>
                <p className="t-body mt-4 text-[--color-text-muted]">{categoryIntro(cat, locale)}</p>
              </Reveal>
              {/* Single-package category → wide feature panel, never a lone card. */}
              {rows.length === 1 ? (
                <div className="mt-10">
                  <article className="card grid overflow-hidden lg:grid-cols-2">
                    <div className="ratio-4-3 relative lg:aspect-auto"><Image src={rows[0].image} alt={pkgTitle(rows[0], locale)} fill sizes="(max-width:1024px) 100vw, 680px" loading="lazy" className="object-cover" /></div>
                    <div className="flex flex-col justify-center p-8 lg:p-12">
                      {rows[0].popular && <span className="mb-4 w-fit rounded-full bg-gradient-to-r from-[--color-brand] to-[--color-brand-2] px-3 py-1.5 text-[13px] font-semibold text-white">{t("popular")}</span>}
                      <h3 className="t-card font-[family-name:--font-display]">{pkgTitle(rows[0], locale)}</h3>
                      <p className="mt-4 leading-relaxed text-[--color-text-muted]">{pkgBestFor(rows[0], locale)}</p>
                      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">{pkgFeatures(rows[0], locale).slice(0, 4).map((f) => (<li key={f} className="flex items-start gap-2.5 text-[14px] text-[--color-text-muted]"><Check className="mt-1 size-3.5 shrink-0 text-[--color-brand-light]" aria-hidden />{f}</li>))}</ul>
                      <div className="mt-7 flex items-center justify-between gap-4 border-t border-[--border-hairline] pt-6">
                        <p className="font-[family-name:--font-display] text-[24px] font-extrabold">{formatPrice(rows[0].price, locale, rows[0].billingType)}</p>
                        <Link href={`/store/${rows[0].slug}`} className="btn btn-primary btn-md">{t("viewPackage")}</Link>
                      </div>
                    </div>
                  </article>
                </div>
              ) : (
                <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {rows.map((p) => <PackageCard key={p.slug} pkg={p} />)}
                </div>
              )}
            </section>
          );
        })}

        <Reveal>
          <div className="mt-24 relative overflow-hidden rounded-[--radius-lg] border border-[--color-border-strong] bg-[--color-bg-elev] px-8 py-16 text-center lg:px-16">
            <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
            <div className="relative">
              <h2 className="t-section mx-auto max-w-3xl font-[family-name:--font-display]">{t("customTitle")}</h2>
              <p className="mx-auto mt-6 max-w-xl text-[--color-text-muted]">{t("customBody")}</p>
              <Link href="/contact" className="btn btn-primary btn-lg group mt-10">{t("customCta")}<ArrowRight className="flip-rtl size-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
