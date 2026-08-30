import type { Locale } from "@/i18n/routing";
import { PolicyPage } from "@/components/policy-page";
import { getPolicy } from "@/data/legal";
import { pageMetadata } from "@/lib/seo";
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) { const { locale } = await params; const p = getPolicy(locale, "terms"); return pageMetadata(locale, "terms", "terms", { title: "title", desc: "subtitle" }).then((m) => ({ ...m, title: p.title, description: p.subtitle })); }

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} policy="terms" />;
}
