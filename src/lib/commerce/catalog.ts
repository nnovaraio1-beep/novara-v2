// NOTE: `import "server-only"` belongs here but isn't installed; this module is
// imported only from route handlers / server components. Add it on first install.
import { PACKAGES } from "@/data/packages";
import { ADDONS } from "@/data/addons";
import { SERVICES } from "@/data/services";

/**
 * THE server-side price source. The browser says WHAT (slug + add-on slugs);
 * it never says what it costs. Every total is recomputed here. A request body
 * claiming `total: 1` produces the real total.
 *
 * Money is whole JOD in the data files; we compute in fils (×1000) to avoid
 * float drift, then the UI formats back to JOD.
 */
const PKG = new Map(PACKAGES.map((p) => [p.slug, p]));
const SVC = new Map(SERVICES.map((s) => [s.slug, s]));
const ADD = new Map(ADDONS.map((a) => [a.slug, a]));

export interface RawLine { slug: string; kind: "package" | "service"; quantity?: number; addons?: string[] }

export interface ResolvedLine {
  slug: string; kind: "package" | "service"; name: string;
  unitFils: number | null; billing: "monthly" | "once" | "custom";
  quantity: number; addonSlugs: string[]; addonsFils: number; lineFils: number;
}

export interface ResolvedOrder {
  lines: ResolvedLine[];
  subtotalFils: number; discountFils: number; taxFils: number; totalFils: number;
  currency: "JOD"; requiresQuote: boolean; hasSubscription: boolean;
}

const TAX_RATE = Number(process.env.TAX_RATE ?? "0");

const COUPONS: Record<string, { percent?: number; amountFils?: number }> = {
  // WELCOME10: { percent: 10 },  // validated server-side only
};

function applyCoupon(subtotalFils: number, code?: string): number {
  if (!code) return 0;
  const c = COUPONS[code.trim().toUpperCase()];
  if (!c) return 0;
  const off = c.percent ? Math.round((subtotalFils * c.percent) / 100) : (c.amountFils ?? 0);
  return Math.min(off, subtotalFils);
}

export function resolveOrder(rawLines: RawLine[], coupon?: string): ResolvedOrder {
  const lines: ResolvedLine[] = [];

  for (const raw of rawLines) {
    const item = raw.kind === "service" ? SVC.get(raw.slug) : PKG.get(raw.slug);
    if (!item) continue; // unknown slug is dropped, never trusted

    // Monthly subscriptions are quantity-1; silently multiplying would misinvoice.
    const quantity = item.billingType === "monthly" ? 1 : Math.min(Math.max(raw.quantity ?? 1, 1), 20);
    const addonSlugs = (raw.addons ?? []).filter((s) => ADD.has(s));
    const addonsFils = addonSlugs.reduce((s, k) => s + (ADD.get(k)!.price * 1000), 0);
    const unitFils = item.price === null ? null : item.price * 1000;
    const lineFils = unitFils === null ? 0 : unitFils * quantity + addonsFils;

    lines.push({
      slug: item.slug, kind: raw.kind,
      name: item.titleEn, unitFils, billing: item.billingType,
      quantity, addonSlugs, addonsFils, lineFils,
    });
  }

  const requiresQuote = lines.some((l) => l.unitFils === null);
  const hasSubscription = lines.some((l) => l.billing === "monthly");
  const subtotalFils = lines.reduce((s, l) => s + l.lineFils, 0);
  const discountFils = applyCoupon(subtotalFils, coupon);
  const taxable = subtotalFils - discountFils;
  const taxFils = Math.round(taxable * TAX_RATE);

  return { lines, subtotalFils, discountFils, taxFils, totalFils: taxable + taxFils, currency: "JOD", requiresQuote, hasSubscription };
}

export const packageExists = (slug: string) => PKG.has(slug);
export const serviceExists = (slug: string) => SVC.has(slug);
