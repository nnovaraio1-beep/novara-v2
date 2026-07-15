import { Reveal } from "./reveal";

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden border-b border-[--border-hairline]">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="animate-drift pointer-events-none absolute -top-32 start-[10%] size-[420px] rounded-full bg-[--color-brand]/14 blur-[130px]" aria-hidden />
      <div className="container-x relative section-sm">
        <Reveal className="max-w-3xl">
          <p className="t-label text-[--color-brand-light]">{eyebrow}</p>
          <h1 className="t-hero mt-5 font-[family-name:--font-display]">{title}</h1>
          <p className="t-body mt-6 text-[--color-text-muted]">{subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}
