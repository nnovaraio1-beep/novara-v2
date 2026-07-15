"use client";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { ServicePrice } from "@/components/service-price";
import type { Service } from "@/data/services";

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const t = useTranslations("services");
  const locale = useLocale();
  const title = locale === "ar" ? service.titleAr : service.titleEn;
  const summary = locale === "ar" ? service.valueAr : service.valueEn;
  const timeline = locale === "ar" ? service.timelineAr : service.timelineEn;

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-colors hover:border-[--color-border-strong]">
      <Link href={`/services/${service.slug}`} className="relative block">
        <div className="ratio-16-10 relative overflow-hidden">
          <Image src={service.image} alt={title} fill loading={index < 3 ? "eager" : "lazy"}
            sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 420px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[--color-bg-elev] via-transparent to-transparent" />
          <span className="absolute start-4 top-4 rounded-full border border-white/12 bg-black/50 px-3 py-1.5 text-[13px] text-[--color-brand-light] backdrop-blur">{service.category}</span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-[22px] font-bold leading-snug"><Link href={`/services/${service.slug}`} className="hover:text-[--color-brand-light]">{title}</Link></h3>
        <p className="clamp-2 mt-2.5 min-h-[44px] text-[14.5px] text-[--color-text-muted]">{summary}</p>
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-[--border-hairline] pt-5">
          <div>
            <p className="t-label text-[--color-text-dim]">{t("from")}</p>
            <ServicePrice price={service.price} billing={service.billingType} locale={locale} size={22} />
          </div>
          <p className="flex shrink-0 items-center gap-1.5 text-[13px] text-[--color-text-dim]"><Clock className="size-3.5" aria-hidden />{timeline}</p>
        </div>
        <Link href={`/services/${service.slug}`} className="btn btn-ghost group/l mt-6 self-start p-0 text-[15px]">
          {t("viewDetails")}<ArrowRight className="flip-rtl size-4 transition-transform group-hover/l:translate-x-1" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
