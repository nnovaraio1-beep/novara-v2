import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/page-header";
import { getCurrentCustomer } from "@/server/customer/auth";
import { databaseConfigured } from "@/server/db";
import { ProfileForm } from "@/components/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; setRequestLocale(locale);
  if (!databaseConfigured()) redirect(`/${locale}/login`);
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/${locale}/login`);
  const ar = locale === "ar";

  return (
    <>
      <PageHeader eyebrow={ar ? "حسابي" : "My account"} title={ar ? "الملف الشخصي" : "Profile"} subtitle={ar ? "عدّل بياناتك الشخصية" : "Update your personal information"} />
      <section className="container-x pb-28">
        <ProfileForm
          locale={locale}
          initial={{ name: customer.name, email: customer.email, phone: customer.phone ?? "", company: customer.company ?? "", taxNumber: customer.taxNumber ?? "" }}
        />
      </section>
    </>
  );
}
