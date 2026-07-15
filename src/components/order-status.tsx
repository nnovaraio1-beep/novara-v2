"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Clock, Landmark, FileText, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/pricing";

interface OrderData { orderNumber: string; status: string; paymentConfirmed: boolean; totalFils: number; requiresQuote: boolean; lines: { name: string; quantity: number; billing: string }[] }

export function OrderStatusView({ orderNumber, mode }: { orderNumber: string | null; mode: string | null }) {
  const t = useTranslations("orderSuccess");
  const locale = useLocale();
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(Boolean(orderNumber));

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders/${encodeURIComponent(orderNumber)}`).then((r) => r.ok ? r.json() : null).then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, [orderNumber]);

  if (!orderNumber) return <div className="card mt-10 p-8"><p className="text-[--color-text-muted]">{t("noOrder")}</p><Link href="/store" className="btn btn-primary btn-md mt-6">{t("browse")}</Link></div>;
  if (loading) return <div className="card mt-10 flex items-center gap-3 p-8"><Loader2 className="size-4 animate-spin" aria-hidden />{t("loading")}</div>;

  const confirmed = data?.paymentConfirmed ?? false;
  const Icon = confirmed ? CheckCircle2 : mode === "bank_transfer" ? Landmark : mode === "quotation" ? FileText : Clock;

  return (
    <div className="mt-10">
      <div className="card p-8">
        <div className="flex items-start gap-4">
          <Icon className={`mt-1 size-6 shrink-0 ${confirmed ? "text-emerald-400" : "text-[--color-brand-light]"}`} aria-hidden />
          <div>
            {/* "paid" appears only when the server confirmed it. */}
            <p className="text-[19px] font-bold">{confirmed ? t("confirmed") : mode === "quotation" ? t("quoteReceived") : mode === "bank_transfer" ? t("awaitingTransfer") : t("awaitingPayment")}</p>
            <p className="mt-2 text-[14px] text-[--color-text-dim]">{t("orderNumber")}: <span className="font-[family-name:--font-mono] text-[--color-text]">{orderNumber}</span></p>
          </div>
        </div>
        {data && <>
          <ul className="mt-8 space-y-3 border-t border-[--border-hairline] pt-6">{data.lines.map((l) => (<li key={l.name} className="flex justify-between gap-4 text-[15px]"><span className="text-[--color-text-muted]">{l.name} ×{l.quantity}</span><span className="text-[13px] text-[--color-text-dim]">{l.billing === "monthly" ? t("monthly") : t("oneTime")}</span></li>))}</ul>
          {!data.requiresQuote && <div className="mt-6 flex justify-between border-t border-[--border-hairline] pt-6"><span className="t-label text-[--color-text-dim]">{t("total")}</span><span className="font-[family-name:--font-display] text-[24px] font-extrabold">{formatPrice(Math.round(data.totalFils / 1000), locale)}</span></div>}
        </>}
        {mode === "bank_transfer" && <p className="mt-6 rounded-[--radius-md] border border-[--border-hairline] bg-[--color-surface] p-5 text-[14px] leading-relaxed text-[--color-text-muted]">{t("bankInstructions")}</p>}
      </div>
      <div className="card mt-6 p-8"><h2 className="text-[19px] font-bold">{t("nextSteps")}</h2><p className="mt-3 text-[15px] leading-relaxed text-[--color-text-muted]">{t("responseTime")}</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/register" className="btn btn-primary btn-md">{t("createAccount")}</Link><Link href="/contact" className="btn btn-secondary btn-md">{t("support")}</Link></div></div>
    </div>
  );
}
