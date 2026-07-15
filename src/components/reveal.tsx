"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, lead, center = false }: {
  eyebrow: string; title: string; lead?: string; center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="t-label text-[--color-brand-light]">{eyebrow}</p>
      <h2 className="t-section mt-5 font-[family-name:--font-display]">{title}</h2>
      {lead && <p className="t-body mt-5 text-[--color-text-muted]">{lead}</p>}
    </Reveal>
  );
}
