"use client";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { Check, Loader2, AlertTriangle, CreditCard, Landmark, FileText } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/pricing";
import { PACKAGES } from "@/data/packages";
import { SERVICES } from "@/data/services";
import { ADDONS } from "@/data/addons";

type Step = 0 | 1 | 2 | 3 | 4;
type Method = "online" | "bank_transfer" | "quotation";

function findItem(slug: string) {
  const p = PACKAGES.find((x) => x.slug === slug);
  if (p) return { slug: p.slug, kind: "package" as const, price: p.price, billing: p.billingType, titleEn: p.titleEn, titleAr: p.titleAr };
  const s = SERVICES.find((x) => x.slug === slug);
  if (s) return { slug: s.slug, kind: "service" as const, price: s.price, billing: s.billingType, titleEn: s.titleEn, titleAr: s.titleAr };
  return null;
}

export function CheckoutFlow({ onlineAvailable, manualAvailable }: { onlineAvailable: boolean; manualAvailable: boolean }) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const cart = useCart();
  const ar = locale === "ar";
  const [step, setStep] = useState<Step>(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", company: "", country: "Jordan", city: "", address: "", taxNumber: "", coupon: "", notes: "", acceptTerms: false, acceptPrivacy: false });

  const addonPrice = new Map(ADDONS.map((a) => [a.slug, a.price]));
  const rows = cart.lines.map((line) => ({ line, item: findItem(line.slug) })).filter((r): r is { line: typeof r.line; item: NonNullable<ReturnType<typeof findItem>> } => Boolean(r.item));
  const requiresQuote = rows.some((r) => r.item.price === null);
  const subtotal = rows.reduce((s, { line, item }) => item.price === null ? s : s + item.price * line.quantity + line.addons.reduce((a, k) => a + (addonPrice.get(k) ?? 0), 0), 0);

  const methods: Method[] = useMemo(() => {
    if (requiresQuote) return ["quotation"];
    const m: Method[] = [];
    if (onlineAvailable) m.push("online");
    if (manualAvailable) m.push("bank_transfer");
    m.push("quotation");
    return m;
  }, [requiresQuote, onlineAvailable, manualAvailable]);
  const [method, setMethod] = useState<Method>(methods[0]);

  const steps = ["info", "review", "addons", "billing", "payment"] as const;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const canAdvance = step === 0 ? form.fullName.length > 1 && emailOk : step === 3 ? form.city.length > 0 && form.country.length > 0 : true;

  async function submit() {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/checkout/session", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, acceptTerms: String(form.acceptTerms), acceptPrivacy: String(form.acceptPrivacy), paymentMethod: method,
          lines: cart.lines.map((l) => ({ slug: l.slug, kind: findItem(l.slug)?.kind ?? "package", quantity: l.quantity, addons: l.addons })) }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error === "online_payment_unavailable" ? t("errors.unavailable") : t("errors.generic")); setBusy(false); return; }
      cart.clear();
      if (data.mode === "online" && data.redirectUrl) { window.location.href = data.redirectUrl; return; }
      router.push(`/order/success?order=${encodeURIComponent(data.orderNumber)}&mode=${data.mode}`);
    } catch { setError(t("errors.network")); setBusy(false); }
  }

  if (cart.ready && rows.length === 0) return (
    <div className="container-x section text-center"><h1 className="t-section font-[family-name:--font-display]">{t("emptyTitle")}</h1><Link href="/store" className="btn btn-primary btn-lg mt-8">{t("browse")}</Link></div>
  );

  const field = (name: keyof typeof form, type = "text", required = false) => (
    <label className="block"><span className="t-label text-[--color-text-dim]">{t(`fields.${name}`)}{required && " *"}</span>
      <input type={type} required={required} value={String(form[name])} onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        className="mt-2 h-12 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-bg] px-4 text-[15px] outline-none focus:border-[--color-brand]/60" /></label>
  );

  return (
    <div className="container-x section-sm">
      <h1 className="t-section font-[family-name:--font-display]">{t("title")}</h1>
      <p className="mt-4 text-[--color-text-muted]">{t("guestNotice")}</p>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <ol className="mb-10 flex flex-wrap gap-x-6 gap-y-2">
            {steps.map((s, i) => (<li key={s} className={`flex items-center gap-2 text-[14px] ${i === step ? "text-[--color-text]" : "text-[--color-text-dim]"}`}>
              <span className={`grid size-7 place-items-center rounded-full border text-[13px] ${i < step ? "border-transparent bg-[--color-brand] text-white" : "border-[--border-hairline]"}`}>{i < step ? <Check className="size-3.5" aria-hidden /> : i + 1}</span>{t(`steps.${s}`)}</li>))}
          </ol>
          <div className="card p-8">
            {step === 0 && <div className="grid gap-5 sm:grid-cols-2">{field("fullName", "text", true)}{field("email", "email", true)}{field("phone", "tel")}{field("company")}</div>}
            {step === 1 && <ul className="space-y-4">{rows.map(({ line, item }) => (<li key={line.slug} className="flex justify-between gap-4 border-b border-[--border-hairline] pb-4 last:border-0"><div><p className="font-semibold">{ar ? item.titleAr : item.titleEn}</p><p className="text-[13px] text-[--color-text-dim]">{item.billing === "monthly" ? t("monthly") : t("oneTime")} · ×{line.quantity}</p></div><p className="shrink-0 font-semibold">{item.price === null ? t("quoteOnly") : formatPrice(item.price * line.quantity, locale)}</p></li>))}</ul>}
            {step === 2 && <div><p className="text-[--color-text-muted]">{t("addonsBody")}</p><ul className="mt-6 space-y-3">{rows.flatMap(({ line }) => line.addons).length === 0 ? <li className="text-[--color-text-dim]">{t("noAddons")}</li> : rows.flatMap(({ line }) => ADDONS.filter((a) => line.addons.includes(a.slug)).map((a) => (<li key={`${line.slug}-${a.slug}`} className="flex justify-between gap-4 text-[15px]"><span className="text-[--color-text-muted]">{ar ? a.titleAr : a.titleEn}</span><span>{formatPrice(a.price, locale)}</span></li>)))}</ul></div>}
            {step === 3 && <div className="grid gap-5 sm:grid-cols-2">{field("country", "text", true)}{field("city", "text", true)}<div className="sm:col-span-2">{field("address")}</div>{field("taxNumber")}{field("coupon")}<label className="block sm:col-span-2"><span className="t-label text-[--color-text-dim]">{t("fields.notes")}</span><textarea rows={4} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="mt-2 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-bg] p-4 text-[15px] outline-none focus:border-[--color-brand]/60" /></label></div>}
            {step === 4 && <div>
              {!onlineAvailable && !requiresQuote && <p className="mb-6 flex items-start gap-3 rounded-[--radius-md] border border-[--border-hairline] bg-[--color-surface] p-4 text-[14px] leading-relaxed text-[--color-text-muted]"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-[--color-text-dim]" aria-hidden />{t("noGatewayNotice")}</p>}
              <fieldset className="space-y-3"><legend className="t-label mb-3 text-[--color-text-dim]">{t("paymentMethod")}</legend>
                {methods.map((m) => { const Icon = m === "online" ? CreditCard : m === "bank_transfer" ? Landmark : FileText; return (
                  <label key={m} className={`flex cursor-pointer items-start gap-3.5 rounded-[--radius-md] border p-4 transition ${method === m ? "border-[--color-brand]/60 bg-[--color-brand]/10" : "border-[--border-hairline]"}`}>
                    <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} className="mt-1 accent-[--color-brand]" /><Icon className="mt-0.5 size-4 shrink-0 text-[--color-brand-light]" aria-hidden />
                    <span><span className="block font-semibold">{t(`methods.${m}.title`)}</span><span className="mt-1 block text-[14px] leading-relaxed text-[--color-text-muted]">{t(`methods.${m}.body`)}</span></span></label>); })}
              </fieldset>
              <div className="mt-7 space-y-3">
                <label className="flex items-start gap-3 text-[14px] text-[--color-text-muted]"><input type="checkbox" checked={form.acceptTerms} onChange={(e) => setForm((f) => ({ ...f, acceptTerms: e.target.checked }))} className="mt-1 size-4 accent-[--color-brand]" />{t("acceptTerms")}</label>
                <label className="flex items-start gap-3 text-[14px] text-[--color-text-muted]"><input type="checkbox" checked={form.acceptPrivacy} onChange={(e) => setForm((f) => ({ ...f, acceptPrivacy: e.target.checked }))} className="mt-1 size-4 accent-[--color-brand]" />{t("acceptPrivacy")}</label>
              </div>
              {error && <p className="mt-6 rounded-[--radius-sm] border border-red-500/40 bg-red-500/10 p-4 text-[14px] text-red-200">{error}</p>}
            </div>}
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-[--border-hairline] pt-6">
              <button onClick={() => setStep((s) => Math.max(0, s - 1) as Step)} disabled={step === 0} className="btn btn-ghost btn-md disabled:opacity-40">{t("back")}</button>
              {step < 4 ? <button onClick={() => setStep((s) => (s + 1) as Step)} disabled={!canAdvance} className="btn btn-primary btn-md disabled:opacity-40">{t("next")}</button>
                : <button onClick={submit} disabled={busy || !form.acceptTerms || !form.acceptPrivacy} className="btn btn-primary btn-lg disabled:opacity-40">{busy && <Loader2 className="size-4 animate-spin" aria-hidden />}{method === "quotation" ? t("submitQuote") : t("placeOrder")}</button>}
            </div>
          </div>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start"><div className="glass rounded-[--radius-lg] p-7">
          <h2 className="text-[19px] font-bold">{t("summary")}</h2>
          <ul className="mt-6 space-y-3 border-b border-[--border-hairline] pb-6">{rows.map(({ line, item }) => (<li key={line.slug} className="flex justify-between gap-4 text-[14px]"><span className="text-[--color-text-muted]">{ar ? item.titleAr : item.titleEn}</span><span className="shrink-0">{item.price === null ? t("quoteOnly") : formatPrice(item.price * line.quantity, locale)}</span></li>))}</ul>
          <div className="mt-6 flex items-baseline justify-between"><p className="t-label text-[--color-text-dim]">{t("total")}</p><p className="text-gradient font-[family-name:--font-display] text-[28px] font-extrabold">{requiresQuote ? t("quoteOnly") : formatPrice(subtotal, locale)}</p></div>
          <p className="mt-5 text-[13px] leading-relaxed text-[--color-text-dim]">{t("serverPriceNotice")}</p>
        </div></aside>
      </div>
    </div>
  );
}
