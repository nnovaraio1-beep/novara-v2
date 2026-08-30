import { PolicyPage } from "@/components/policy-page";
import type { Locale } from "@/i18n/routing";
import { getPolicy } from "@/data/legal";
import { itemMetadata } from "@/lib/seo";
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) { const { locale } = await params; const p = getPolicy(locale, "refund"); return itemMetadata(locale, "refund-policy", p.title, p.subtitle); }
export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) { const { locale } = await params; return <PolicyPage locale={locale} policy="refund" />; }
