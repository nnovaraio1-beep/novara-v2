import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { socialTiers, enterpriseSocial, pkgTitle, pkgFeatures } from "@/data/packages";
import { formatPrice } from "@/lib/pricing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "social", "social-media");
}

export default async function SocialMediaPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("social");
  const tiers = socialTiers();
  const ent = enterpriseSocial();

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="container-x section-sm">
        <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((p) => (
            <article key={p.slug} className={`relative flex h-full flex-col rounded-[--radius-lg] border bg-[--color-bg-elev] p-7 ${p.popular ? "border-[--color-brand]/60" : "border-[--border-hairline]"}`}>
              {p.popular && <span className="absolute -top-3 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[--color-brand] to-[--color-brand-2] px-4 py-1.5 text-[13px] font-semibold text-white">{t("popular")}</span>}
              <h2 className="text-[21px] font-bold">{pkgTitle(p, locale)}</h2>
              <p className="mt-5 font-[family-name:--font-display] text-[30px] font-extrabold leading-none">{formatPrice(p.price, locale, p.billingType)}</p>
              <ul className="mt-6 flex-1 space-y-2.5 border-t border-[--border-hairline] pt-6">{pkgFeatures(p, locale).map((f) => (<li key={f} className="flex items-start gap-2.5 text-[14px] text-[--color-text-muted]"><Check className="mt-1 size-3.5 shrink-0 text-[--color-brand-light]" aria-hidden />{f}</li>))}</ul>
              <Link href={`/store/${p.slug}`} className={`btn btn-md mt-7 w-full ${p.popular ? "btn-primary" : "btn-secondary"}`}>{t("choose")}</Link>
            </article>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 card grid items-center gap-8 p-8 lg:grid-cols-[1.4fr_1fr] lg:p-12">
            <div>
              <span className="rounded-full border border-[--border-hairline] px-3 py-1.5 text-[13px] text-[--color-brand-light]">{t("enterpriseTag")}</span>
              <h2 className="t-card mt-5 font-[family-name:--font-display]">{pkgTitle(ent, locale)}</h2>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">{pkgFeatures(ent, locale).map((f) => (<li key={f} className="flex items-start gap-2.5 text-[14px] text-[--color-text-muted]"><Check className="mt-1 size-3.5 shrink-0 text-[--color-brand-light]" aria-hidden />{f}</li>))}</ul>
            </div>
            <div className="text-center lg:text-start"><p className="font-[family-name:--font-display] text-[28px] font-extrabold">{formatPrice(null, locale)}</p><Link href={`/store/${ent.slug}`} className="btn btn-primary btn-lg mt-6 w-full lg:w-auto">{t("requestQuote")}</Link></div>
          </div>
        </Reveal>

        <p className="mt-8 rounded-[--radius-md] border border-amber-500/30 bg-amber-500/[0.08] p-5 text-center text-[15px] font-medium text-amber-200">{t("adSpendNote")}</p>
      </section>
    </>
  );
}
