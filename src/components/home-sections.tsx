import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check, Share2, Palette, Film, Globe, ShoppingCart, Cpu } from "lucide-react";
import { Reveal, SectionHeading } from "./reveal";
import { ServiceCard } from "./service-card";
import { SERVICES } from "@/data/services";
import { socialTiers } from "@/data/packages";
import { formatPrice } from "@/lib/pricing";

const CAPS = [
  { key: "social", Icon: Share2 }, { key: "branding", Icon: Palette }, { key: "video", Icon: Film },
  { key: "web", Icon: Globe }, { key: "ecommerce", Icon: ShoppingCart }, { key: "software", Icon: Cpu },
] as const;

export async function Capabilities() {
  const t = await getTranslations("capabilities");
  return (
    <section className="border-y border-[--border-hairline] bg-[--color-bg-elev]/50">
      <div className="container-x py-10">
        <p className="t-label mb-8 text-center text-[--color-text-dim]">{t("title")}</p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
          {CAPS.map(({ key, Icon }) => (
            <li key={key} className="flex flex-col items-center gap-3 text-center">
              <span className="grid size-11 place-items-center rounded-xl border border-[--border-hairline] bg-[--color-surface]"><Icon className="size-5 text-[--color-brand-light]" aria-hidden /></span>
              <span className="text-[14px] font-medium text-[--color-text-muted]">{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function FeaturedServices() {
  const t = await getTranslations("featuredServices");
  const featured = SERVICES.filter((s) => s.feature).slice(0, 6);
  return (
    <section className="container-x section">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <div className="mt-16 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
      </div>
      <Reveal className="mt-14 text-center"><Link href="/services" className="btn btn-secondary btn-lg group">{t("viewAll")}<ArrowRight className="flip-rtl size-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link></Reveal>
    </section>
  );
}

export async function FeaturedPackages() {
  const t = await getTranslations("featuredPackages");
  const locale = await getLocale();
  const tiers = socialTiers();
  return (
    <section className="container-x section">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <div className="mt-16 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((p) => (
          <article key={p.slug} className={`relative flex h-full flex-col rounded-[--radius-lg] border bg-[--color-bg-elev] p-7 ${p.popular ? "border-[--color-brand]/60" : "border-[--border-hairline]"}`}>
            {p.popular && <span className="absolute -top-3 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[--color-brand] to-[--color-brand-2] px-4 py-1.5 text-[13px] font-semibold text-white">{t("popular")}</span>}
            <h3 className="text-[22px] font-bold">{locale === "ar" ? p.titleAr : p.titleEn}</h3>
            <p className="clamp-2 mt-2 min-h-[44px] text-[14px] text-[--color-text-dim]">{locale === "ar" ? p.bestForAr : p.bestForEn}</p>
            <p className="mt-6 font-[family-name:--font-display] text-[32px] font-extrabold leading-none">{formatPrice(p.price, locale, p.billingType)}</p>
            <ul className="mt-6 flex-1 space-y-2.5 border-t border-[--border-hairline] pt-6">
              {(locale === "ar" ? p.featuresAr : p.featuresEn).slice(0, 5).map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-[--color-text-muted]"><Check className="mt-1 size-3.5 shrink-0 text-[--color-brand-light]" aria-hidden />{f}</li>
              ))}
            </ul>
            <Link href={`/store/${p.slug}`} className={`btn btn-md mt-7 w-full ${p.popular ? "btn-primary" : "btn-secondary"}`}>{t("choose")}</Link>
          </article>
        ))}
      </div>
      <Reveal className="mt-12 text-center"><Link href="/store" className="btn btn-ghost group p-0">{t("viewAll")}<ArrowRight className="flip-rtl size-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link></Reveal>
    </section>
  );
}

export async function WhyNovara() {
  const t = await getTranslations("why");
  return (
    <section className="section-light section">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="t-label text-[--color-brand-2]">{t("eyebrow")}</p>
          <h2 className="t-section mt-5 font-[family-name:--font-display] text-[--color-ink]">{t("title")}</h2>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {(["a", "b", "c", "d"] as const).map((k, i) => (
            <Reveal key={k} delay={i * 0.06}><div className="card-light h-full p-8"><h3 className="text-[19px] font-bold text-[--color-ink]">{t(`${k}.title`)}</h3><p className="mt-3 text-[15px] leading-relaxed text-[--color-ink-2]">{t(`${k}.body`)}</p></div></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function Process() {
  const t = await getTranslations("process");
  return (
    <section className="container-x section">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(["discover", "design", "build", "handover"] as const).map((k, i) => (
          <Reveal key={k} delay={i * 0.06}><div className="card h-full p-8"><span className="font-[family-name:--font-mono] text-[13px] text-[--color-brand-light]">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-4 text-[19px] font-bold">{t(`${k}.title`)}</h3><p className="mt-3 text-[15px] leading-relaxed text-[--color-text-muted]">{t(`${k}.body`)}</p></div></Reveal>
        ))}
      </div>
    </section>
  );
}

export async function Faq() {
  const t = await getTranslations("faq");
  return (
    <section id="faq" className="container-x section">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} center />
      <div className="mx-auto mt-14 max-w-3xl divide-y divide-[--border-hairline] rounded-[--radius-lg] border border-[--border-hairline]">
        {(["a", "b", "c", "d"] as const).map((k) => (
          <details key={k} className="group p-6"><summary className="cursor-pointer list-none text-[17px] font-semibold">{t(`${k}.q`)}</summary><p className="mt-3 leading-relaxed text-[--color-text-muted]">{t(`${k}.a`)}</p></details>
        ))}
      </div>
    </section>
  );
}

export async function ContactCta() {
  const t = await getTranslations("cta");
  return (
    <section className="container-x section">
      <Reveal>
        <div className="relative overflow-hidden rounded-[--radius-lg] border border-[--color-border-strong] bg-[--color-bg-elev] px-8 py-20 text-center lg:px-16">
          <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
          <div className="animate-drift absolute -top-40 start-1/2 size-[520px] -translate-x-1/2 rounded-full bg-[--color-brand]/16 blur-[130px]" aria-hidden />
          <div className="relative">
            <h2 className="t-section mx-auto max-w-3xl font-[family-name:--font-display]">{t("title")}</h2>
            <p className="mx-auto mt-6 max-w-xl text-[--color-text-muted]">{t("subtitle")}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn btn-primary btn-lg group">{t("primary")}<ArrowRight className="flip-rtl size-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link>
              <Link href="/store" className="btn btn-secondary btn-lg">{t("secondary")}</Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
