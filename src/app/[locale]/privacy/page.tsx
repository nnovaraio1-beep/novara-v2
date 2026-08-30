import type { Locale } from "@/i18n/routing";
import { PolicyPage } from "@/components/policy-page";
import { getPolicy } from "@/data/legal";
import { pageMetadata } from "@/lib/seo";
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) { const { locale } = await params; const p = getPolicy(locale, "privacy"); return pageMetadata(locale, "privacy", "privacy", { title: "title", desc: "subtitle" }).then((m) => ({ ...m, title: p.title, description: p.subtitle })); }

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} policy="privacy" />;
}
