"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordField } from "./password-field";

export function LoginForm({ labels }: { labels: { email: string; password: string; remember: string; forgot: string; signIn: string } }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      });
      const data = await res.json();
      if (data.ok) { router.push("/account"); router.refresh(); }
      else setError(data.error || data.message || "Sign in failed.");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {error && <div role="alert" className="rounded-[--radius-sm] border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-300">{error}</div>}
      <label className="block"><span className="t-label text-[--color-text-dim]">{labels.email}</span>
        <input type="email" name="email" required autoComplete="email" className="mt-2 h-12 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-bg] px-4 outline-none focus:border-[--color-brand]/60" /></label>
      <PasswordField label={labels.password} name="password" autoComplete="current-password" />
      <div className="flex items-center justify-between text-[14px]">
        <label className="flex items-center gap-2 text-[--color-text-muted]"><input type="checkbox" name="remember" className="size-4 accent-[--color-brand]" />{labels.remember}</label>
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">{loading ? "…" : labels.signIn}</button>
    </form>
  );
}