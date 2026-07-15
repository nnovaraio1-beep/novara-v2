"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { CartButton } from "./cart-button";
import { Menu, X, ArrowRight, User } from "lucide-react";

const NAV = [
  { key: "services", href: "/services" },
  { key: "social", href: "/social-media" },
  { key: "store", href: "/store" },
  { key: "portfolio", href: "/portfolio" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 bg-[--color-bg] lg:bg-transparent ${scrolled ? "border-b border-[--border-hairline] lg:bg-[--color-bg]/75 lg:backdrop-blur-xl" : ""}`}>
      <nav className="container-x flex h-20 items-center justify-between gap-8" aria-label={t("mainNav")}>
        <div className="flex items-center gap-10 xl:gap-12">
          <Link href="/" aria-label={t("home")} className="shrink-0">
            <Image src="/brand/novara-logo.png" alt="NOVARA" width={320} height={76} priority className="h-[64px] w-auto" sizes="280px" />
          </Link>
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map(({ key, href }) => (
              <li key={key}>
                <Link href={href} aria-current={active(href) ? "page" : undefined}
                  className={`relative block rounded-lg px-4 py-2.5 text-[15px] font-medium transition-colors ${active(href) ? "text-[--color-text]" : "text-[--color-text-muted] hover:text-[--color-text]"}`}>
                  {t(key)}
                  {active(href) && <span className="absolute inset-x-3 -bottom-[21px] h-0.5 rounded-full bg-gradient-to-r from-[--color-brand] to-[--color-brand-2]" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block"><LanguageSwitcher /></div>
          <Link href="/login" aria-label={t("signIn")} className="hidden size-11 place-items-center rounded-xl border border-[--border-hairline] text-[--color-text-muted] transition-colors hover:text-[--color-text] sm:grid">
            <User className="size-5" aria-hidden />
          </Link>
          <CartButton />
          <Link href="/contact" className="btn btn-primary btn-md group hidden md:inline-flex">
            {t("cta")}
            <ArrowRight className="flip-rtl size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <button onClick={() => setOpen(true)} aria-label={t("openMenu")} aria-expanded={open}
            className="grid size-11 place-items-center rounded-xl border border-[--border-hairline] text-[--color-text-muted] lg:hidden">
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col lg:hidden" style={{ backgroundColor: "#040711" }}>
          <div className="container-x flex h-20 items-center justify-between">
            <Image src="/brand/novara-logo.png" alt="NOVARA" width={320} height={76} className="h-[62px] w-auto" />
            <button onClick={() => setOpen(false)} aria-label={t("closeMenu")} className="grid size-11 place-items-center rounded-xl border border-[--border-hairline] text-[--color-text-muted]">
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <ul className="container-x flex flex-1 flex-col gap-1 overflow-y-auto pt-6">
            {NAV.map(({ key, href }) => (
              <li key={key}><Link href={href} className="block border-b border-[--border-hairline] py-5 text-2xl font-semibold">{t(key)}</Link></li>
            ))}
            <li><Link href="/login" className="block border-b border-[--border-hairline] py-5 text-2xl font-semibold">{t("signIn")}</Link></li>
          </ul>
          <div className="container-x flex flex-col gap-4 pb-10 pt-6">
            <LanguageSwitcher />
            <Link href="/contact" className="btn btn-primary btn-lg w-full">{t("cta")}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
