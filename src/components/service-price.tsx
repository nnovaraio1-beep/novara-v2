import { formatPrice, type Billing } from "@/lib/pricing";
import { applyPromo, promoIsLive, PROMOTION } from "@/data/promotion";

export function ServicePrice({ price, billing, locale, size = 22, kind = "service" }: { price: number | null; billing: Billing; locale: string; size?: number; kind?: "service" | "package" }) {
  const sale = applyPromo(price, kind);
  const ar = locale === "ar";

  if (sale === null || price === null) {
    return <p className="mt-1 font-[family-name:--font-display] font-extrabold leading-none" style={{ fontSize: size }}>{formatPrice(price, locale, billing)}</p>;
  }

  return (
    <div className="mt-1">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-[family-name:--font-display] font-extrabold leading-none text-[--color-brand-light]" style={{ fontSize: size }}>{formatPrice(sale, locale, billing)}</p>
        <span className="rounded-full bg-[--color-accent]/15 px-2 py-0.5 text-[12px] font-bold text-[--color-accent]">{ar ? PROMOTION.labelAr : PROMOTION.labelEn}</span>
      </div>
      <p className="mt-1 text-[14px] text-[--color-text-dim] line-through">{formatPrice(price, locale, billing)}</p>
    </div>
  );
}

export function PromoBanner({ locale }: { locale: string }) {
  if (!promoIsLive()) return null;
  const ar = locale === "ar";
  const endsAt = new Date(PROMOTION.endsAt).toLocaleDateString(ar ? "ar-JO-u-nu-latn" : "en-GB", { day: "numeric", month: "long" });
  return (
    <div className="mb-10 flex items-center justify-center gap-3 rounded-[--radius-md] border border-[--color-accent]/30 bg-[--color-accent]/[0.08] px-5 py-3 text-center">
      <span className="rounded-full bg-[--color-accent]/20 px-2.5 py-1 text-[13px] font-bold text-[--color-accent]">{ar ? PROMOTION.labelAr : PROMOTION.labelEn}</span>
      <span className="text-[14px] text-[--color-text-muted]">
        {ar ? `خصم ${PROMOTION.percentOff}٪ على جميع الخدمات والباقات حتى ${endsAt}` : `${PROMOTION.percentOff}% off everything until ${endsAt}`}
      </span>
    </div>
  );
}
