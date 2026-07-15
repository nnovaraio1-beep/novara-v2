import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/register-form";

export default async function RegisterPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <AuthShell title={t("registerTitle")} subtitle={t("registerSubtitle")} footer={<>{t("haveAccount")} <Link href="/login" className="text-[--color-brand-light] underline underline-offset-4">{t("signIn")}</Link></>}>
      <RegisterForm labels={{ name: t("fullName"), email: t("email"), password: t("password"), passwordHint: t("passwordHint"), createAccount: t("createAccount") }} />
    </AuthShell>
  );
}