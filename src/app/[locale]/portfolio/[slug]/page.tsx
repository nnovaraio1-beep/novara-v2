import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { itemMetadata } from "@/lib/seo";
import { Check } from "lucide-react";
import { getProject, projectSlugs, projTitle, projSummary, PROJECTS } from "@/data/portfolio";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projectSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const p = getProject(slug); if (!p) return {};
  return itemMetadata(locale, `portfolio/${slug}`, locale === "ar" ? p.titleAr : p.titleEn, locale === "ar" ? p.summaryAr : p.summaryEn, p.image);
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const p = getProject(slug); if (!p) notFound();
  const t = await getTranslations("portfolio");
  const ar = locale === "ar";
  const more = PROJECTS.filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <div className="pb-28">
      <section className="relative"><div className="relative h-[420px] overflow-hidden lg:h-[520px]"><Image src={p.image} alt={projTitle(p, locale)} fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[--color-bg] via-[--color-bg]/60 to-[--color-bg]/30" /></div>
        <div className="container-x relative -mt-40"><nav className="mb-6 text-[14px] text-[--color-text-dim]"><Link href="/portfolio" className="hover:text-[--color-text]">{t("title")}</Link></nav><span className="rounded-full border border-white/12 bg-black/55 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur">{t("conceptBadge")}</span><h1 className="t-hero mt-5 max-w-4xl font-[family-name:--font-display]">{projTitle(p, locale)}</h1><p className="t-body mt-6 max-w-[62ch] text-[--color-text-muted]">{projSummary(p, locale)}</p></div>
      </section>
      <div className="container-x mt-16 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <section><h2 className="t-card font-[family-name:--font-display]">{t("brief")}</h2><p className="t-body mt-5 leading-relaxed text-[--color-text-muted]">{ar ? p.briefAr : p.briefEn}</p></section>
          <section className="mt-12"><h2 className="t-card font-[family-name:--font-display]">{t("approach")}</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2">{(ar ? p.approachAr : p.approachEn).map((a) => (<li key={a} className="flex items-start gap-3 rounded-[--radius-md] border border-[--border-hairline] p-4 text-[15px] text-[--color-text-muted]"><Check className="mt-0.5 size-4 shrink-0 text-[--color-brand-light]" aria-hidden />{a}</li>))}</ul></section>
        </div>
        <aside><div className="card p-7"><h2 className="t-label text-[--color-text-dim]">{t("disciplines")}</h2><ul className="mt-4 flex flex-wrap gap-2">{(ar ? p.disciplinesAr : p.disciplinesEn).map((d) => (<li key={d} className="rounded-full border border-[--border-hairline] px-3 py-1.5 text-[13px] text-[--color-text-muted]">{d}</li>))}</ul><Link href="/contact" className="btn btn-primary btn-md mt-7 w-full">{t("startSimilar")}</Link></div></aside>
      </div>
      <section className="container-x mt-20"><h2 className="t-card font-[family-name:--font-display]">{t("moreWork")}</h2><div className="mt-8 grid gap-6 sm:grid-cols-3">{more.map((m) => (<Link key={m.slug} href={`/portfolio/${m.slug}`} className="card group overflow-hidden"><div className="ratio-16-9 relative overflow-hidden"><Image src={m.image} alt={projTitle(m, locale)} fill sizes="33vw" loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" /></div><div className="p-5"><p className="font-semibold">{projTitle(m, locale)}</p></div></Link>))}</div></section>
    </div>
  );
}
