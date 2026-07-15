"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Check, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/pricing";
import { type Package } from "@/data/packages";
import { ADDONS, addonTitle } from "@/data/addons";

export function PurchasePanel({ pkg }: { pkg: Package }) {
  const t = useTranslations("store");
  const locale = useLocale();
  const router = useRouter();
  const cart = useCart();
  const [selected, setSelected] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);
  const custom = pkg.price === null;
  const addonTotal = ADDONS.filter((a) => selected.includes(a.slug)).reduce((s, a) => s + a.price, 0);
  const total = (pkg.price ?? 0) + addonTotal;
  const line = () => ({ slug: pkg.slug, quantity: 1, addons: selected, billing: pkg.billingType });

  return (
    <div className="glass rounded-[--radius-lg] p-7">
      {custom ? (
        <><p className="t-label text-[--color-text-dim]">{t("pricing")}</p><p className="mt-2 text-[26px] font-bold">{formatPrice(null, locale)}</p><p className="mt-4 text-[15px] leading-relaxed text-[--color-text-muted]">{t("customQuoteBody")}</p></>
      ) : (
        <><p className="t-label text-[--color-text-dim]">{t("total")}</p><p className="mt-2 font-[family-name:--font-display] text-[36px] font-extrabold leading-none">{formatPrice(total, locale, pkg.billingType)}</p></>
      )}
      {!custom && ADDONS.length > 0 && (
        <fieldset className="mt-7 border-t border-[--border-hairline] pt-6">
          <legend className="t-label mb-4 text-[--color-text-dim]">{t("addons")}</legend>
          <div className="max-h-[260px] space-y-2 overflow-y-auto pe-1">
            {ADDONS.map((a) => {
              const on = selected.includes(a.slug);
              return (
                <label key={a.slug} className={`flex cursor-pointer items-center gap-3 rounded-[--radius-sm] border p-3 transition ${on ? "border-[--color-brand]/60 bg-[--color-brand]/10" : "border-[--border-hairline] hover:border-[--color-border-strong]"}`}>
                  <input type="checkbox" checked={on} className="size-4 accent-[--color-brand]" onChange={() => setSelected((s) => on ? s.filter((k) => k !== a.slug) : [...s, a.slug])} />
                  <span className="flex-1 text-[14px]">{addonTitle(a, locale)}</span>
                  <span className="text-[13px] text-[--color-text-dim]">{formatPrice(a.price, locale)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
      <div className="mt-7 flex flex-col gap-3">
        {custom ? (
          <button onClick={() => router.push("/contact")} className="btn btn-primary btn-lg w-full">{t("requestQuote")}</button>
        ) : (
          <>
            <button onClick={() => { setBusy(true); cart.add(line()); router.push("/cart"); }} disabled={busy} className="btn btn-primary btn-lg w-full">{busy && <Loader2 className="size-4 animate-spin" aria-hidden />}{t("buyNow")}</button>
            <button onClick={() => { cart.add(line()); setAdded(true); setTimeout(() => setAdded(false), 2000); }} className="btn btn-secondary btn-lg w-full">{added ? <Check className="size-4" aria-hidden /> : <ShoppingCart className="size-4" aria-hidden />}{added ? t("added") : t("addToCart")}</button>
          </>
        )}
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-[--color-text-dim]">{t("noAccountNeeded")}</p>
    </div>
  );
}

export function MobileBuyBar({ pkg }: { pkg: Package }) {
  const t = useTranslations("store");
  const locale = useLocale();
  const cart = useCart();
  const router = useRouter();
  const custom = pkg.price === null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[--border-hairline] bg-[--color-bg]/95 p-4 backdrop-blur-xl lg:hidden">
      <div className="container-x flex items-center gap-4">
        <div className="flex-1"><p className="text-[13px] text-[--color-text-dim]">{custom ? t("pricing") : t("total")}</p><p className="text-[19px] font-bold">{formatPrice(pkg.price, locale, pkg.billingType)}</p></div>
        <button onClick={() => { if (custom) { router.push("/contact"); return; } cart.add({ slug: pkg.slug, quantity: 1, addons: [], billing: pkg.billingType }); router.push("/cart"); }} className="btn btn-primary btn-md shrink-0">{custom ? t("requestQuote") : t("addToCart")}</button>
      </div>
    </div>
  );
}
