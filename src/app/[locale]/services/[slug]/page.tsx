import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { itemMetadata } from "@/lib/seo";
import { Check, Clock } from "lucide-react";
import { getService, serviceSlugs, SERVICES } from "@/data/services";
import { ServicePrice } from "@/components/service-price";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => serviceSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const s = getService(slug); if (!s) return {};
  return itemMetadata(locale, `services/${slug}`, locale === "ar" ? s.titleAr : s.titleEn, locale === "ar" ? s.valueAr : s.valueEn, s.image);
}

export default async function ServiceDetail({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const s = getService(slug);
  if (!s) notFound();
  const t = await getTranslations("serviceDetail");
  const ar = locale === "ar";
  const related = SERVICES.filter((x) => x.group === s.group && x.slug !== s.slug).slice(0, 3);

  return (
    <div className="pb-28">
      <section className="relative">
        <div className="relative h-[420px] overflow-hidden lg:h-[520px]">
          <Image src={s.image} alt={ar ? s.titleAr : s.titleEn} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[--color-bg] via-[--color-bg]/60 to-[--color-bg]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[--color-bg]/80 to-transparent" />
        </div>
        <div className="container-x relative -mt-16 lg:-mt-40">
          <nav aria-label={t("breadcrumb")} className="mb-6 flex items-center gap-2 text-[14px] text-[--color-text-dim]"><Link href="/services" className="hover:text-[--color-text]">{t("services")}</Link><span aria-hidden>/</span><span className="text-[--color-text]">{ar ? s.titleAr : s.titleEn}</span></nav>
          <span className="rounded-full border border-[--border-hairline] bg-[--color-surface]/60 px-4 py-2 text-[13px] text-[--color-brand-light] backdrop-blur">{s.category}</span>
          <h1 className="t-hero mt-6 max-w-4xl font-[family-name:--font-display]">{ar ? s.titleAr : s.titleEn}</h1>
          <p className="t-body mt-6 max-w-[62ch] text-[--color-text-muted]">{ar ? s.valueAr : s.valueEn}</p>
        </div>
      </section>
      <div className="container-x mt-16 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          <section><h2 className="t-card font-[family-name:--font-display]">{t("overview")}</h2><p className="t-body mt-5 leading-relaxed text-[--color-text-muted]">{ar ? s.descriptionAr : s.descriptionEn}</p></section>
          <section className="mt-14"><h2 className="t-card font-[family-name:--font-display]">{t("deliverables")}</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2">{(ar ? s.featuresAr : s.featuresEn).map((f) => (<li key={f} className="flex items-start gap-3 rounded-[--radius-md] border border-[--border-hairline] p-4 text-[15px] text-[--color-text-muted]"><Check className="mt-0.5 size-4 shrink-0 text-[--color-brand-light]" aria-hidden />{f}</li>))}</ul></section>
          <section className="mt-14"><h2 className="t-card font-[family-name:--font-display]">{t("process")}</h2><ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(ar ? s.processAr : s.processEn).map((p, i) => (<li key={p} className="card p-6"><span className="font-[family-name:--font-mono] text-[13px] text-[--color-brand-light]">{String(i + 1).padStart(2, "0")}</span><p className="mt-3 font-semibold">{p}</p></li>))}</ol></section>
          {related.length > 0 && (<section className="mt-14"><h2 className="t-card font-[family-name:--font-display]">{t("related")}</h2><div className="mt-6 grid gap-6 sm:grid-cols-3">{related.map((r) => (<Link key={r.slug} href={`/services/${r.slug}`} className="card group overflow-hidden"><div className="ratio-16-9 relative overflow-hidden"><Image src={r.image} alt={ar ? r.titleAr : r.titleEn} fill sizes="33vw" loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" /></div><div className="p-5"><p className="font-semibold">{ar ? r.titleAr : r.titleEn}</p></div></Link>))}</div></section>)}
        </div>
        <aside className="hidden lg:block"><div className="sticky top-28 glass rounded-[--radius-lg] p-7"><p className="t-label text-[--color-text-dim]">{t("from")}</p><ServicePrice price={s.price} billing={s.billingType} locale={locale} size={36} /><p className="mt-4 flex items-center gap-2 text-[14px] text-[--color-text-dim]"><Clock className="size-4" aria-hidden />{ar ? s.timelineAr : s.timelineEn}</p><div className="mt-7 flex flex-col gap-3"><Link href="/contact" className="btn btn-primary btn-lg w-full">{t("requestQuote")}</Link><Link href="/store" className="btn btn-secondary btn-md w-full">{t("viewPackages")}</Link></div></div></aside>
      </div>
    </div>
  );
}
