"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();
  const rise = (d: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: d, ease: [0.16, 1, 0.3, 1] as const },
  });
  return (
    <section className="relative flex min-h-[740px] items-center overflow-hidden lg:min-h-[780px]">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="animate-drift pointer-events-none absolute -top-40 start-[4%] size-[520px] rounded-full bg-[--color-brand]/18 blur-[140px]" aria-hidden />
      <div className="animate-float pointer-events-none absolute -bottom-24 end-[2%] size-[420px] rounded-full bg-[--color-brand-2]/14 blur-[130px]" aria-hidden />
      <div className="container-x relative grid items-center gap-16 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
        <div>
          <motion.p {...rise(0)} className="t-label text-[--color-brand-light]">{t("eyebrow")}</motion.p>
          <motion.h1 {...rise(0.07)} className="t-hero mt-6 font-[family-name:--font-display]">{t("titleA")} <span className="text-gradient">{t("titleHighlight")}</span></motion.h1>
          <motion.p {...rise(0.14)} className="t-body mt-7 max-w-[56ch] text-[--color-text-muted]">{t("subtitle")}</motion.p>
          <motion.div {...rise(0.21)} className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/contact" className="btn btn-primary btn-lg group">{t("primary")}<ArrowRight className="flip-rtl size-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link>
            <Link href="/store" className="btn btn-secondary btn-lg">{t("secondary")}</Link>
          </motion.div>
          <motion.ul {...rise(0.28)} className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {(["a", "b", "c"] as const).map((k) => (
              <li key={k} className="flex items-center gap-2.5 text-[14px] text-[--color-text-dim]"><Check className="size-4 shrink-0 text-[--color-brand-light]" aria-hidden />{t(`trust.${k}`)}</li>
            ))}
          </motion.ul>
        </div>
        <motion.div initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto w-full max-w-[640px]">
          <div className="glass relative overflow-hidden rounded-[--radius-lg] p-2">
            <Image src="/images/services/social-media-management.webp" alt={t("imageAlt")} width={1400} height={875} priority sizes="(max-width:1024px) 100vw, 640px" className="rounded-[14px]" />
            <div className="pointer-events-none absolute inset-0 rounded-[--radius-lg] bg-gradient-to-t from-[--color-bg]/35 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
