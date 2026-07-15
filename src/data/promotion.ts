/**
 * حملة خصم مركزية على مستوى الموقع. مكان واحد للتحكم.
 * لإيقاف الحملة: خلّي active = false.
 */
export interface Promotion {
  active: boolean;
  percentOff: number;
  endsAt: string;
  appliesTo: ("service" | "package")[];
  labelEn: string;
  labelAr: string;
}

export const PROMOTION: Promotion = {
  active: true,
  percentOff: 25,
  endsAt: "2026-08-12",
  appliesTo: ["service", "package"],
  labelEn: "25% OFF",
  labelAr: "خصم ٢٥٪",
};

/** هل الحملة شغّالة الآن؟ */
export function promoIsLive(now: Date = new Date()): boolean {
  return PROMOTION.active && new Date(PROMOTION.endsAt) > now;
}

/** يطبّق الخصم على سعر (بالدينار). يرجّع null لو السعر null. */
export function applyPromo(priceJod: number | null, kind: "service" | "package"): number | null {
  if (priceJod === null) return null;
  if (!promoIsLive() || !PROMOTION.appliesTo.includes(kind)) return null;
  const discounted = priceJod * (1 - PROMOTION.percentOff / 100);
  return Math.round(discounted);
}
