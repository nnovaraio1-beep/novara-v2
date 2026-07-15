import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "faq", "faq");
}

export default async function FaqPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("faq");
  const keys = ["a", "b", "c", "d", "e", "f"] as const;
  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="container-x section-sm"><div className="mx-auto max-w-3xl divide-y divide-[--border-hairline] rounded-[--radius-lg] border border-[--border-hairline]">
        {keys.map((k) => (<details key={k} className="group p-6"><summary className="cursor-pointer list-none text-[17px] font-semibold">{t(`items.${k}.q`)}</summary><p className="mt-3 leading-relaxed text-[--color-text-muted]">{t(`items.${k}.a`)}</p></details>))}
      </div></section>
    </>
  );
}
