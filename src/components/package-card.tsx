"use client";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { ServicePrice } from "@/components/service-price";
import { type Package, pkgTitle, pkgBestFor, pkgFeatures } from "@/data/packages";

export function PackageCard({ pkg }: { pkg: Package }) {
  const t = useTranslations("store");
  const locale = useLocale();
  const custom = pkg.price === null;

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-colors hover:border-[--color-border-strong]">
      <Link href={`/store/${pkg.slug}`} className="relative block">
        <div className="ratio-16-9 relative overflow-hidden">
          <Image src={pkg.image} alt={pkgTitle(pkg, locale)} fill loading="lazy" sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[--color-bg-elev] via-[--color-bg-elev]/20 to-transparent" />
          <span className="absolute start-4 top-4 rounded-full border border-white/12 bg-black/50 px-3 py-1.5 text-[13px] text-[--color-brand-light] backdrop-blur">{pkg.category}</span>
          {pkg.popular && <span className="absolute end-4 top-4 rounded-full bg-gradient-to-r from-[--color-brand] to-[--color-brand-2] px-3 py-1.5 text-[13px] font-semibold text-white">{t("popular")}</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-[22px] font-bold leading-snug"><Link href={`/store/${pkg.slug}`} className="hover:text-[--color-brand-light]">{pkgTitle(pkg, locale)}</Link></h3>
        <p className="clamp-2 mt-2.5 min-h-[44px] text-[14.5px] text-[--color-text-muted]">{pkgBestFor(pkg, locale)}</p>
        <div className="mt-6"><ServicePrice price={pkg.price} billing={pkg.billingType} locale={locale} size={26} kind="package" /></div>
        <ul className="mt-6 flex-1 space-y-2.5 border-t border-[--border-hairline] pt-6">
          {pkgFeatures(pkg, locale).slice(0, 5).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[14px] text-[--color-text-muted]"><Check className="mt-1 size-3.5 shrink-0 text-[--color-brand-light]" aria-hidden />{f}</li>
          ))}
        </ul>
        <Link href={`/store/${pkg.slug}`} className="btn btn-primary btn-sm mt-7 w-full">{custom ? t("requestQuote") : t("viewPackage")}</Link>
      </div>
    </article>
  );
}
