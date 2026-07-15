import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { AuthShell } from "@/components/auth-shell";

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <AuthShell title={t("forgotTitle")} subtitle={t("forgotSubtitle")} footer={<Link href="/login" className="text-[--color-brand-light] underline underline-offset-4">{t("backToLogin")}</Link>}>
      <form className="space-y-5" action="/api/auth/forgot-password" method="post">
        <label className="block"><span className="t-label text-[--color-text-dim]">{t("email")}</span><input type="email" name="email" required autoComplete="email" className="mt-2 h-12 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-bg] px-4 outline-none focus:border-[--color-brand]/60" /></label>
        <button type="submit" className="btn btn-primary btn-lg w-full">{t("sendReset")}</button>
        <p className="text-[13px] leading-relaxed text-[--color-text-dim]">{t("resetPrivacy")}</p>
      </form>
    </AuthShell>
  );
}
