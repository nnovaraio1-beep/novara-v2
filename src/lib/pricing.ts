/**
 * THE currency formatter. Money is integer FILS (1 JOD = 1000 fils) internally,
 * but the data files below express price in whole JOD for readability, so this
 * accepts JOD and formats it.
 *
 *   English → JOD 250 / month      Arabic → 250 د.أ / شهرياً
 *
 * Composed manually rather than via Intl currency style, which renders JOD as
 * "JOD 250.000" and puts the symbol on the wrong side in Arabic.
 */
export type Billing = "monthly" | "once" | "custom";

function numberLocale(locale: string) {
  // Jordan writes Western digits, so pin the numbering system.
  return locale === "ar" ? "ar-JO-u-nu-latn" : "en-US";
}

export function formatNumber(value: number, locale = "en") {
  return new Intl.NumberFormat(numberLocale(locale)).format(value);
}

export function formatPrice(jod: number | null, locale = "en", billing: Billing = "once") {
  if (jod === null) return locale === "ar" ? "عرض سعر مخصّص" : "Custom quotation";
  const amount = formatNumber(jod, locale);
  const core = locale === "ar" ? `${amount} د.أ` : `JOD ${amount}`;
  if (billing === "monthly") return locale === "ar" ? `${core} / شهرياً` : `${core} / month`;
  return core;
}
