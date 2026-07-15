import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { itemMetadata } from "@/lib/seo";
import { getPost, postSlugs, postTitle, postBody, POSTS } from "@/data/blog";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => postSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const p = getPost(slug); if (!p) return {};
  return itemMetadata(locale, `blog/${slug}`, locale === "ar" ? p.titleAr : p.titleEn, locale === "ar" ? p.excerptAr : p.excerptEn, p.image);
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const p = getPost(slug); if (!p) notFound();
  const t = await getTranslations("blog");
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-JO-u-nu-latn" : "en-US", { year: "numeric", month: "long", day: "numeric" });
  const more = POSTS.filter((x) => x.slug !== p.slug).slice(0, 2);
  return (
    <div className="pb-28">
      <section className="relative"><div className="relative h-[380px] overflow-hidden lg:h-[460px]"><Image src={p.image} alt={postTitle(p, locale)} fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[--color-bg] via-[--color-bg]/60 to-[--color-bg]/30" /></div>
        <div className="container-x relative -mt-32"><nav className="mb-6 text-[14px] text-[--color-text-dim]"><Link href="/blog" className="hover:text-[--color-text]">{t("title")}</Link></nav><p className="text-[13px] text-[--color-brand-light]">{p.category} · {fmt.format(new Date(p.dateISO))}</p><h1 className="t-hero mt-4 max-w-4xl font-[family-name:--font-display]">{postTitle(p, locale)}</h1></div>
      </section>
      <article className="container-x mt-14"><div className="mx-auto max-w-2xl space-y-6">{postBody(p, locale).map((para, i) => (<p key={i} className="t-body leading-relaxed text-[--color-text-muted]">{para}</p>))}</div></article>
      {more.length > 0 && <section className="container-x mt-20"><h2 className="t-card font-[family-name:--font-display]">{t("more")}</h2><div className="mt-8 grid gap-6 sm:grid-cols-2">{more.map((m) => (<Link key={m.slug} href={`/blog/${m.slug}`} className="card group overflow-hidden"><div className="ratio-16-9 relative overflow-hidden"><Image src={m.image} alt={postTitle(m, locale)} fill sizes="50vw" loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" /></div><div className="p-6"><p className="font-semibold">{postTitle(m, locale)}</p></div></Link>))}</div></section>}
    </div>
  );
}
