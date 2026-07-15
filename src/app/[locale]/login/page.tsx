import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <AuthShell title={t("loginTitle")} subtitle={t("loginSubtitle")} footer={<>{t("noAccount")} <Link href="/register" className="text-[--color-brand-light] underline underline-offset-4">{t("register")}</Link></>}>
      <LoginForm labels={{ email: t("email"), password: t("password"), remember: t("remember"), forgot: t("forgot"), signIn: t("signIn") }} />
    </AuthShell>
  );
}