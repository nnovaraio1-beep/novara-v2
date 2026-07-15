import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { itemMetadata } from "@/lib/seo";
import { Check, Clock } from "lucide-react";
import { getPackage, packageSlugs, packagesByCategory, pkgTitle, pkgBestFor, pkgFeatures, pkgTimeline } from "@/data/packages";
import { PurchasePanel } from "@/components/purchase-panel";
import { PackageCard } from "@/components/package-card";
import { MobileBuyBar } from "@/components/purchase-panel";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => packageSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const p = getPackage(slug); if (!p) return {};
  return itemMetadata(locale, `store/${slug}`, locale === "ar" ? p.titleAr : p.titleEn, locale === "ar" ? p.descriptionAr : p.descriptionEn, p.image);
}

export default async function PackageDetail({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = getPackage(slug);
  if (!p) notFound();
  const t = await getTranslations("packageDetail");
  const ar = locale === "ar";
  const related = packagesByCategory(p.category).filter((x) => x.slug !== p.slug).slice(0, 3);
  const note = ar ? p.noteAr : p.noteEn;

  const stats = [
    p.platforms && { label: t("platforms"), value: p.platforms },
    p.posts && { label: t("posts"), value: p.posts },
    p.stories && { label: t("stories"), value: p.stories },
    p.videos && { label: t("videos"), value: p.videos },
  ].filter(Boolean) as { label: string; value: number }[];

  return (
    <div className="pb-28 pt-10">
      <div className="container-x">
        <nav aria-label={t("breadcrumb")} className="mb-10 flex items-center gap-2 text-[14px] text-[--color-text-dim]"><Link href="/store" className="hover:text-[--color-text]">{t("store")}</Link><span aria-hidden>/</span><span className="text-[--color-text]">{pkgTitle(p, locale)}</span></nav>
        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div>
            <div className="ratio-16-9 relative overflow-hidden rounded-[--radius-lg] border border-[--border-hairline]"><Image src={p.image} alt={pkgTitle(p, locale)} fill priority sizes="(max-width:1024px) 100vw, 900px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[--color-bg]/50 to-transparent" /></div>
            <div className="mt-10">
              <div className="flex flex-wrap items-center gap-3"><span className="rounded-full border border-[--border-hairline] px-3.5 py-1.5 text-[13px] text-[--color-brand-light]">{p.category}</span><span className="flex items-center gap-2 text-[13px] text-[--color-text-dim]"><Clock className="size-3.5" aria-hidden />{pkgTimeline(p, locale)}</span></div>
              <h1 className="t-section mt-6 font-[family-name:--font-display]">{pkgTitle(p, locale)}</h1>
              <p className="t-body mt-5 max-w-[62ch] text-[--color-text-muted]">{pkgBestFor(p, locale)}</p>
              {stats.length > 0 && (<dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">{stats.map((s) => (<div key={s.label} className="card p-5"><dt className="t-label text-[--color-text-dim]">{s.label}</dt><dd className="mt-2 font-[family-name:--font-display] text-[28px] font-extrabold leading-none">{s.value}</dd></div>))}</dl>)}
              {note && <p className="mt-8 rounded-[--radius-md] border border-amber-500/30 bg-amber-500/[0.08] p-5 text-[15px] font-medium leading-relaxed text-amber-200">{note}</p>}
              <section className="mt-14"><h2 className="t-card font-[family-name:--font-display]">{t("included")}</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2">{pkgFeatures(p, locale).map((f) => (<li key={f} className="flex items-start gap-3 text-[15px] text-[--color-text-muted]"><Check className="mt-0.5 size-4 shrink-0 text-[--color-brand-light]" aria-hidden />{f}</li>))}</ul></section>
            </div>
          </div>
          <aside className="hidden lg:block"><div className="sticky top-28"><PurchasePanel pkg={p} /></div></aside>
        </div>
        {related.length > 0 && (<section className="mt-28"><h2 className="t-card font-[family-name:--font-display]">{t("related")}</h2><div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">{related.map((r) => <PackageCard key={r.slug} pkg={r} />)}</div></section>)}
      </div>
      <MobileBuyBar pkg={p} />
    </div>
  );
}
