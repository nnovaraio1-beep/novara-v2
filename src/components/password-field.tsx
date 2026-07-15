"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({ label, name, autoComplete, minLength }: { label: string; name: string; autoComplete?: string; minLength?: number }) {
  const t = useTranslations("auth");
  const [show, setShow] = useState(false);
  return (
    <label className="block"><span className="t-label text-[--color-text-dim]">{label}</span>
      <div className="relative mt-2">
        <input type={show ? "text" : "password"} name={name} required autoComplete={autoComplete} minLength={minLength}
          className="h-12 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-bg] px-4 pe-12 outline-none focus:border-[--color-brand]/60" />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? t("hidePassword") : t("showPassword")}
          className="absolute end-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-[--color-text-dim] hover:text-[--color-text]">
          {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
    </label>
  );
}
