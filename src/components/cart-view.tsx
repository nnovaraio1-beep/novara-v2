"use client";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/pricing";
import { PACKAGES, pkgTitle } from "@/data/packages";
import { ADDONS, addonTitle } from "@/data/addons";

export function CartView() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const cart = useCart();
  const addonPrice = new Map(ADDONS.map((a) => [a.slug, a.price]));
  const rows = cart.lines.map((line) => ({ line, pkg: PACKAGES.find((p) => p.slug === line.slug) })).filter((r): r is { line: typeof r.line; pkg: NonNullable<typeof r.pkg> } => Boolean(r.pkg));
  const subtotal = rows.reduce((s, { line, pkg }) => pkg.price === null ? s : s + pkg.price * line.quantity + line.addons.reduce((a, k) => a + (addonPrice.get(k) ?? 0), 0), 0);
  const requiresQuote = rows.some((r) => r.pkg.price === null);

  if (!cart.ready) return <div className="h-64 animate-pulse rounded-[--radius-lg] border border-[--border-hairline]" aria-hidden />;
  if (rows.length === 0) return (
    <div className="card flex flex-col items-center p-20 text-center"><ShoppingBag className="size-10 text-[--color-text-dim]" aria-hidden /><p className="mt-6 text-[19px] font-semibold">{t("empty")}</p><p className="mt-2 text-[--color-text-muted]">{t("emptyBody")}</p><Link href="/store" className="btn btn-primary btn-lg mt-8">{t("browse")}</Link></div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <ul className="space-y-5">
        {rows.map(({ line, pkg }) => {
          const lineAddons = ADDONS.filter((a) => line.addons.includes(a.slug));
          const lineTotal = pkg.price === null ? null : pkg.price * line.quantity + lineAddons.reduce((s, a) => s + a.price, 0);
          return (
            <li key={line.slug} className="card flex flex-col gap-6 p-6 sm:flex-row">
              <div className="ratio-16-9 relative w-full shrink-0 overflow-hidden rounded-[--radius-md] sm:w-48"><Image src={pkg.image} alt={pkgTitle(pkg, locale)} fill sizes="192px" className="object-cover" /></div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-[13px] text-[--color-brand-light]">{pkg.category}</p><h2 className="mt-1 text-[19px] font-bold"><Link href={`/store/${pkg.slug}`} className="hover:underline">{pkgTitle(pkg, locale)}</Link></h2></div>
                  <button onClick={() => cart.remove(line.slug)} aria-label={t("remove")} className="grid size-9 shrink-0 place-items-center rounded-full border border-[--border-hairline] text-[--color-text-dim] hover:text-[--color-text]"><Trash2 className="size-4" aria-hidden /></button>
                </div>
                {lineAddons.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{lineAddons.map((a) => (<li key={a.slug} className="rounded-full border border-[--border-hairline] px-3 py-1 text-[13px] text-[--color-text-dim]">{addonTitle(a, locale)}</li>))}</ul>}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  {pkg.billingType === "monthly" ? <p className="text-[13px] text-[--color-text-dim]">{t("subscriptionQty")}</p> : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => cart.setQuantity(line.slug, line.quantity - 1)} disabled={line.quantity <= 1} aria-label={t("decrease")} className="grid size-9 place-items-center rounded-full border border-[--border-hairline] disabled:opacity-40"><Minus className="size-3.5" aria-hidden /></button>
                      <span className="w-8 text-center font-semibold">{line.quantity}</span>
                      <button onClick={() => cart.setQuantity(line.slug, line.quantity + 1)} aria-label={t("increase")} className="grid size-9 place-items-center rounded-full border border-[--border-hairline]"><Plus className="size-3.5" aria-hidden /></button>
                    </div>
                  )}
                  <p className="font-[family-name:--font-display] text-[22px] font-extrabold">{lineTotal === null ? t("quoteOnly") : formatPrice(lineTotal, locale, pkg.billingType)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="glass rounded-[--radius-lg] p-7">
          <h2 className="text-[19px] font-bold">{t("summary")}</h2>
          <dl className="mt-7 space-y-3 border-t border-[--border-hairline] pt-6 text-[15px]"><div className="flex justify-between"><dt className="text-[--color-text-muted]">{t("subtotal")}</dt><dd>{formatPrice(subtotal, locale)}</dd></div><div className="flex justify-between"><dt className="text-[--color-text-muted]">{t("tax")}</dt><dd className="text-[--color-text-dim]">{t("atCheckout")}</dd></div></dl>
          <div className="mt-6 flex items-baseline justify-between border-t border-[--border-hairline] pt-6"><p className="t-label text-[--color-text-dim]">{t("total")}</p><p className="text-gradient font-[family-name:--font-display] text-[30px] font-extrabold">{formatPrice(subtotal, locale)}</p></div>
          {requiresQuote && <p className="mt-5 rounded-[--radius-sm] border border-amber-500/25 bg-amber-500/[0.07] p-3 text-[13px] leading-relaxed text-amber-200/90">{t("quoteNotice")}</p>}
          <Link href="/checkout" className="btn btn-primary btn-lg group mt-7 w-full">{t("checkout")}<ArrowRight className="flip-rtl size-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link>
          <Link href="/store" className="btn btn-ghost btn-md mt-2 w-full">{t("continue")}</Link>
          <p className="mt-5 text-center text-[13px] text-[--color-text-dim]">{t("guestOk")}</p>
        </div>
      </aside>
    </div>
  );
}
