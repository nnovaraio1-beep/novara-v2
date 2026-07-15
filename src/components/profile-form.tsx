"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Data { name: string; email: string; phone: string; company: string; taxNumber: string }

export function ProfileForm({ locale, initial }: { locale: string; initial: Data }) {
  const router = useRouter();
  const ar = locale === "ar";
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Data) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setFieldErrors({}); setLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, company: form.company, taxNumber: form.taxNumber }),
      });
      const data = await res.json();
      if (data.ok) { setMsg({ type: "ok", text: ar ? "تم حفظ التغييرات بنجاح." : "Changes saved successfully." }); router.refresh(); }
      else { setFieldErrors(data.fieldErrors || {}); setMsg({ type: "err", text: ar ? "تعذّر الحفظ. راجع الحقول." : "Could not save. Check the fields." }); }
    } catch { setMsg({ type: "err", text: ar ? "خطأ في الاتصال." : "Network error." }); }
    finally { setLoading(false); }
  }

  const L = ar
    ? { name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف", company: "الشركة", tax: "الرقم الضريبي", save: "حفظ التغييرات", emailNote: "لا يمكن تغيير البريد الإلكتروني" }
    : { name: "Full name", email: "Email", phone: "Phone", company: "Company", tax: "Tax number", save: "Save changes", emailNote: "Email cannot be changed" };

  const inputCls = "mt-2 h-12 w-full rounded-[--radius-sm] border border-[--border-hairline] bg-[--color-bg] px-4 outline-none focus:border-[--color-brand]/60";

  return (
    <form onSubmit={onSubmit} className="card max-w-2xl p-8 lg:p-10">
      {msg && <div className={`mb-6 rounded-[--radius-sm] border px-4 py-3 text-[14px] ${msg.type === "ok" ? "border-green-500/40 bg-green-500/10 text-green-300" : "border-red-500/40 bg-red-500/10 text-red-300"}`}>{msg.text}</div>}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2"><span className="t-label text-[--color-text-dim]">{L.name}</span>
          <input value={form.name} onChange={set("name")} className={inputCls} />
          {fieldErrors.name && <span className="mt-1 block text-[13px] text-red-300">{fieldErrors.name}</span>}</label>
        <label className="block sm:col-span-2"><span className="t-label text-[--color-text-dim]">{L.email}</span>
          <input value={form.email} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
          <span className="mt-1 block text-[13px] text-[--color-text-dim]">{L.emailNote}</span></label>
        <label className="block"><span className="t-label text-[--color-text-dim]">{L.phone}</span>
          <input value={form.phone} onChange={set("phone")} dir="ltr" className={inputCls} /></label>
        <label className="block"><span className="t-label text-[--color-text-dim]">{L.company}</span>
          <input value={form.company} onChange={set("company")} className={inputCls} /></label>
        <label className="block sm:col-span-2"><span className="t-label text-[--color-text-dim]">{L.tax}</span>
          <input value={form.taxNumber} onChange={set("taxNumber")} className={inputCls} /></label>
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary btn-lg mt-8">{loading ? "…" : L.save}</button>
    </form>
  );
}
