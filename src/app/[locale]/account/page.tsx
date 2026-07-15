import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import { User, Package, FileText, Bookmark, Receipt, Activity, LifeBuoy } from "lucide-react";
import { getCurrentCustomer } from "@/server/customer/auth";
import { databaseConfigured } from "@/server/db";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic";

const PANELS = [{ key: "profile", Icon: User, href: "/account/profile" }, { key: "orders", Icon: Package, href: null }, { key: "quotations", Icon: FileText, href: null }, { key: "saved", Icon: Bookmark, href: null }, { key: "invoices", Icon: Receipt, href: null }, { key: "projects", Icon: Activity, href: null }, { key: "support", Icon: LifeBuoy, href: "/contact" }] as const;

export default async function AccountPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("account");

  // لو القاعدة غير مهيّأة، أو العميل مش مسجّل — حوّله لتسجيل الدخول.
  if (!databaseConfigured()) redirect(`/${locale}/login`);
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/${locale}/login`);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={`${t("title")}`} subtitle={`${customer.name} · ${customer.email}`} />
      <section className="container-x pb-28">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PANELS.map(({ key, Icon, href }) => {
            const inner = (<><Icon className="size-5 text-[--color-brand-light]" aria-hidden /><h2 className="mt-5 text-[17px] font-bold">{t(`panels.${key}.title`)}</h2><p className="mt-2 text-[14px] leading-relaxed text-[--color-text-muted]">{t(`panels.${key}.body`)}</p></>);
            return href
              ? (<Link key={key} href={href} className="card p-7 transition-colors hover:border-[--color-border-strong]">{inner}</Link>)
              : (<div key={key} className="card p-7 opacity-60">{inner}</div>);
          })}
        </div>
        <div className="mt-10"><LogoutButton label={t("logout")} /></div>
      </section>
    </>
  );
}
