import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

export async function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  const t = await getTranslations("auth");
  return (
    <div className="container-x section-sm"><div className="mx-auto max-w-md">
      <h1 className="t-section font-[family-name:--font-display]">{title}</h1>
      <p className="mt-4 text-[--color-text-muted]">{subtitle}</p>
      <div className="card mt-8 p-8">{children}</div>
      <div className="mt-10 rounded-[--radius-md] border border-[--border-hairline] bg-[--color-surface] p-6 text-center"><p className="text-[15px] font-semibold">{t("guestTitle")}</p><p className="mt-2 text-[14px] leading-relaxed text-[--color-text-muted]">{t("guestBody")}</p><Link href="/store" className="btn btn-ghost btn-md mt-4">{t("continueAsGuest")}</Link></div>
      <div className="mt-8 text-center text-[14px] text-[--color-text-muted]">{footer}</div>
    </div></div>
  );
}