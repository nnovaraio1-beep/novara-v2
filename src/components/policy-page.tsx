import { PageHeader } from "./page-header";
import { POLICY_VERSION, getPolicy } from "@/data/legal";
export function PolicyPage({ locale, policy }: { locale: "en" | "ar"; policy: "privacy" | "terms" | "refund" | "delivery" }) {
  const content = getPolicy(locale, policy);
  return <><PageHeader eyebrow={locale === "ar" ? "قانوني" : "Legal"} title={content.title} subtitle={content.subtitle} /><section className="container-x section-sm"><div className="mx-auto max-w-3xl space-y-8">{content.sections.map((section) => <section key={section.heading}><h2 className="text-[19px] font-bold">{section.heading}</h2><p className="mt-3 leading-relaxed text-[--color-text-muted]">{section.body}</p></section>)}<p className="border-t border-[--border-hairline] pt-8 text-[13px] text-[--color-text-dim]">{locale === "ar" ? `تاريخ السريان والإصدار: ${POLICY_VERSION}` : `Effective date and version: ${POLICY_VERSION}`}</p></div></section></>;
}
