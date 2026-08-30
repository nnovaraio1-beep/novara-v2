import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { AuthShell } from "@/components/auth-shell";
import { NOINDEX_METADATA } from "@/lib/seo";

export const metadata = NOINDEX_METADATA;

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <AuthShell title={t("forgotTitle")} subtitle={t("forgotSubtitle")} footer={<Link href="/login" className="text-[--color-brand-light] underline underline-offset-4">{t("backToLogin")}</Link>}>
      <div className="space-y-5"><p className="text-[15px] leading-relaxed text-[--color-text-muted]">{t("resetSupport")}</p><a href="mailto:hello@nnovara.io" className="btn btn-primary btn-lg w-full">hello@nnovara.io</a><p className="text-[13px] leading-relaxed text-[--color-text-dim]">{t("resetSafety")}</p></div>
    </AuthShell>
  );
}
