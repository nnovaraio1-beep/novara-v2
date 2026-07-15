import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/hero";
import { Capabilities, FeaturedServices, FeaturedPackages, WhyNovara, Process, Faq, ContactCta } from "@/components/home-sections";
import { PromoBanner } from "@/components/service-price";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <div className="container-x pt-12"><PromoBanner locale={locale} /></div>
      <Capabilities />
      <FeaturedServices />
      <FeaturedPackages />
      <WhyNovara />
      <Process />
      <Faq />
      <ContactCta />
    </>
  );
}
