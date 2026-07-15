import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "contact", "contact");
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const f = (k: string) => t(`form.${k}`);
  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="container-x section-sm grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="card p-8 lg:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            {["name", "email", "company", "phone"].map((k) => (<label key={k} className="block"><span className="t-label text-[--color-text-dim]">{f(k)}</span><input className="mt-2 h-12 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-surface] px-4 outline-none focus:border-[--color-brand]/60" /></label>))}
          </div>
          <label className="mt-5 block"><span className="t-label text-[--color-text-dim]">{f("message")}</span><textarea rows={5} className="mt-2 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-surface] p-4 outline-none focus:border-[--color-brand]/60" /></label>
          <button className="btn btn-primary btn-lg mt-6">{f("submit")}</button>
          <p className="mt-4 text-[13px] text-[--color-text-dim]">{t("formNote")}</p>
        </div>
        <aside className="space-y-4">
          {([
            [Mail, t("emailLabel"), "hello@nnovara.io", "mailto:hello@nnovara.io"],
            [MessageCircle, t("whatsappLabel"), "+962 7 96 95 84 87", "https://wa.me/962796958487?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%2C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20NOVARA"],
            [MapPin, t("officeLabel"), t("address"), "https://www.google.com/maps/search/?api=1&query=%D9%84%D8%A4%D9%84%D8%A4%D8%A9%20%D8%A7%D9%84%D8%B9%D8%A8%D8%AF%D9%84%D9%8A%2C%20%D8%B4%D8%A7%D8%B1%D8%B9%20%D8%A7%D9%84%D8%A8%D8%A7%D8%B9%D9%88%D9%86%D9%8A%D8%A9%2C%20%D8%B9%D9%85%D9%91%D8%A7%D9%86%2C%20%D8%A7%D9%84%D8%A3%D8%B1%D8%AF%D9%86"],
            [Clock, t("hoursLabel"), t("hours"), null],
          ] as [typeof Mail, string, string, string | null][]).map(([Icon, label, val, href], i) => {
            const I = Icon;
            const inner = (<><span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[--border-hairline] bg-[--color-surface]"><I className="size-4 text-[--color-brand-light]" aria-hidden /></span><div><p className="t-label text-[--color-text-dim]">{label}</p><p className="mt-1.5 text-[15px]" dir="ltr">{val}</p></div></>);
            return href
              ? (<a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="card flex items-start gap-4 p-6 transition-colors hover:border-[--color-border-strong]">{inner}</a>)
              : (<div key={i} className="card flex items-start gap-4 p-6">{inner}</div>);
          })}
        </aside>
      </section>
    </>
  );
}
