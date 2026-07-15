import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import { POSTS, postTitle, postExcerpt } from "@/data/blog";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "blog", "blog");
}

export default async function BlogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("blog");
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-JO-u-nu-latn" : "en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="container-x section-sm"><div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p) => (
          <article key={p.slug} className="card group flex h-full flex-col overflow-hidden transition-colors hover:border-[--color-border-strong]">
            <Link href={`/blog/${p.slug}`} className="relative block"><div className="ratio-16-9 relative overflow-hidden"><Image src={p.image} alt={postTitle(p, locale)} fill sizes="(max-width:768px) 100vw, 33vw" loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" /></div></Link>
            <div className="flex flex-1 flex-col p-6"><p className="text-[13px] text-[--color-brand-light]">{p.category} · {fmt.format(new Date(p.dateISO))}</p><h2 className="mt-2 text-[19px] font-bold leading-snug"><Link href={`/blog/${p.slug}`} className="hover:text-[--color-brand-light]">{postTitle(p, locale)}</Link></h2><p className="clamp-3 mt-2.5 flex-1 text-[14.5px] text-[--color-text-muted]">{postExcerpt(p, locale)}</p><Link href={`/blog/${p.slug}`} className="btn btn-ghost mt-5 self-start p-0 text-[15px]">{t("readMore")}</Link></div>
          </article>
        ))}
      </div></section>
    </>
  );
}
