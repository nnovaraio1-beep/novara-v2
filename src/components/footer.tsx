import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  const columns = [
    { heading: t("company"), links: [[t("links.about"), "/about"], [t("links.portfolio"), "/portfolio"], [t("links.careers"), "/careers"], [t("links.contact"), "/contact"]] },
    { heading: t("services"), links: [[t("links.social"), "/social-media"], [t("links.branding"), "/services/branding"], [t("links.web"), "/services/web-development"], [t("links.ecommerce"), "/services/ecommerce"], [t("links.ai"), "/services/ai-solutions"]] },
    { heading: t("resources"), links: [[t("links.store"), "/store"], [t("links.faq"), "/faq"], [t("links.blog"), "/blog"], [t("links.privacy"), "/privacy"], [t("links.terms"), "/terms"]] },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[--border-hairline] bg-[--color-bg-elev]">
      <div className="pointer-events-none absolute -bottom-56 start-1/2 size-[720px] -translate-x-1/2 rounded-full bg-[--color-brand]/8 blur-[150px]" aria-hidden />
      <div className="container-x relative section-sm">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_repeat(3,1fr)_1.1fr]">
          <div>
            <Image src="/brand/novara-logo.png" alt="NOVARA" width={360} height={120} className="h-11 w-auto" sizes="280px" />
            <p className="mt-6 max-w-[36ch] t-small leading-relaxed text-[--color-text-muted]">{t("blurb")}</p>
            <div className="mt-7"><LanguageSwitcher /></div>
          </div>
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="t-label text-[--color-text-dim]">{col.heading}</h2>
              <ul className="mt-6 space-y-3.5">
                {col.links.map(([label, href]) => (
                  <li key={href}><Link href={href} className="t-small text-[--color-text-muted] transition-colors hover:text-[--color-text]">{label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="t-label text-[--color-text-dim]">{t("contactCol")}</h2>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-[--color-brand-light]" aria-hidden /><a href="mailto:hello@nnovara.io" className="t-small text-[--color-text-muted] hover:text-[--color-text]">hello@nnovara.io</a></li>
              <li className="flex items-start gap-3"><MessageCircle className="mt-0.5 size-4 shrink-0 text-[--color-brand-light]" aria-hidden /><a href="https://wa.me/962790000000" className="t-small text-[--color-text-muted] hover:text-[--color-text]">{t("whatsapp")}</a></li>
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-[--color-brand-light]" aria-hidden /><address className="t-small not-italic text-[--color-text-muted]">{t("address")}</address></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[--border-hairline] pt-8 sm:flex-row">
          <p className="t-small text-[--color-text-dim]">© {year} NOVARA. {t("rights")}</p>
          <p className="t-label text-[--color-text-dim]">nnovara.io</p>
        </div>
      </div>
    </footer>
  );
}
