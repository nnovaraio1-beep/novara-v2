import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import { PROJECTS, projTitle, projSummary } from "@/data/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "portfolio", "portfolio");
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("portfolio");
  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="container-x section-sm">
        <p className="mb-10 rounded-[--radius-md] border border-[--border-hairline] bg-[--color-surface] p-4 text-[14px] leading-relaxed text-[--color-text-muted]">{t("conceptNote")}</p>
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <article key={p.slug} className="card group flex h-full flex-col overflow-hidden transition-colors hover:border-[--color-border-strong]">
              <Link href={`/portfolio/${p.slug}`} className="relative block"><div className="ratio-4-3 relative overflow-hidden"><Image src={p.image} alt={projTitle(p, locale)} fill sizes="(max-width:768px) 100vw, 33vw" loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" /><span className="absolute start-4 top-4 rounded-full border border-white/12 bg-black/55 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur">{t("conceptBadge")}</span></div></Link>
              <div className="flex flex-1 flex-col p-6"><p className="text-[13px] text-[--color-brand-light]">{p.category}</p><h2 className="mt-1.5 text-[19px] font-bold"><Link href={`/portfolio/${p.slug}`} className="hover:text-[--color-brand-light]">{projTitle(p, locale)}</Link></h2><p className="clamp-2 mt-2 flex-1 text-[14px] text-[--color-text-muted]">{projSummary(p, locale)}</p><Link href={`/portfolio/${p.slug}`} className="btn btn-ghost mt-5 self-start p-0 text-[15px]">{t("viewProject")}</Link></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
