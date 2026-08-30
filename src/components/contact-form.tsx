"use client";
import { FormEvent, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("contact"); const locale = useLocale(); const startedAt = useRef(Date.now());
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("sending"); const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, locale, startedAt: startedAt.current }) });
      if (!response.ok) throw new Error(); setState("sent"); event.currentTarget.reset();
    } catch { setState("error"); }
  }
  const f = (key: string) => t(`form.${key}`);
  return <form onSubmit={submit} className="card p-8 lg:p-10" noValidate={false}>
    <div className="grid gap-5 sm:grid-cols-2">
      {["name", "email", "company", "phone"].map((key) => <label key={key} className="block"><span className="t-label text-[--color-text-dim]">{f(key)}{["name", "email"].includes(key) ? " *" : ""}</span><input name={key} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} required={["name", "email"].includes(key)} minLength={key === "name" ? 2 : undefined} maxLength={key === "email" ? 254 : key === "phone" ? 40 : 160} autoComplete={key === "name" ? "name" : key === "email" ? "email" : key === "phone" ? "tel" : "organization"} className="mt-2 h-12 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-surface] px-4 outline-none focus:border-[--color-brand]/60" /></label>)}
    </div>
    <label className="sr-only" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="mt-5 block"><span className="t-label text-[--color-text-dim]">{f("message")} *</span><textarea name="message" required minLength={10} maxLength={4000} rows={5} className="mt-2 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-surface] p-4 outline-none focus:border-[--color-brand]/60" /></label>
    <button disabled={state === "sending" || state === "sent"} className="btn btn-primary btn-lg mt-6 disabled:opacity-50">{state === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden />}{state === "sent" ? t("sent") : f("submit")}</button>
    <p role="status" className={`mt-4 text-[13px] ${state === "error" ? "text-red-300" : "text-[--color-text-dim]"}`}>{state === "error" ? t("sendError") : state === "sent" ? t("sentNote") : t("formNote")}</p>
  </form>;
}
