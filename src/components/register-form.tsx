"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { PasswordField } from "./password-field";

export function RegisterForm({ labels }: { labels: { name: string; email: string; password: string; passwordHint: string; createAccount: string } }) {
  const router = useRouter();
  const locale = useLocale();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setFieldErrors({}); setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password"), locale }),
      });
      const data = await res.json();
      if (data.ok) { router.push("/account"); router.refresh(); }
      else { setError(data.error || data.message || "Registration failed."); setFieldErrors(data.fieldErrors || {}); }
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {error && <div role="alert" className="rounded-[--radius-sm] border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-300">{error}</div>}
      <label className="block"><span className="t-label text-[--color-text-dim]">{labels.name}</span>
        <input type="text" name="name" required autoComplete="name" className="mt-2 h-12 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-bg] px-4 outline-none focus:border-[--color-brand]/60" />
        {fieldErrors.name && <span className="mt-1 block text-[13px] text-red-300">{fieldErrors.name}</span>}</label>
      <label className="block"><span className="t-label text-[--color-text-dim]">{labels.email}</span>
        <input type="email" name="email" required autoComplete="email" className="mt-2 h-12 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-bg] px-4 outline-none focus:border-[--color-brand]/60" />
        {fieldErrors.email && <span className="mt-1 block text-[13px] text-red-300">{fieldErrors.email}</span>}</label>
      <div>
        <PasswordField label={labels.password} name="password" autoComplete="new-password" />
        {fieldErrors.password ? <span className="mt-1 block text-[13px] text-red-300">{fieldErrors.password}</span>
          : <span className="mt-1 block text-[13px] text-[--color-text-dim]">{labels.passwordHint}</span>}
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">{loading ? "…" : labels.createAccount}</button>
    </form>
  );
}