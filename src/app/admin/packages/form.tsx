"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { A, Field, Input, Textarea, Select, Toggle, Button, Toast, useToast } from "@/components/admin/ui";
import { getCsrf } from "@/components/admin/csrf-client";
import { createPackage, updatePackage } from "./actions";

export interface PackageFormData {
  id?: string; slug: string; categoryKey: string; titleEn: string; titleAr: string; descriptionEn: string; descriptionAr: string;
  priceFils: number | null; salePriceFils: number | null; billingType: string; timelineEn: string; timelineAr: string;
  platforms: number | null; posts: number | null; stories: number | null; reels: number | null; aiVideos: number | null;
  status: string; order: number; popular: boolean; featured: boolean; quoteOnly: boolean; addToCart: boolean; buyNow: boolean;
}

export function PackageForm({ initial, categories }: { initial: PackageFormData; categories: { key: string; titleEn: string }[] }) {
  const router = useRouter();
  const [flags, setFlags] = useState({ popular: initial.popular, featured: initial.featured, quoteOnly: initial.quoteOnly, addToCart: initial.addToCart, buyNow: initial.buyNow });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const { toast, showToast, clearToast } = useToast();
  const isEdit = Boolean(initial.id);
  const setFlag = (k: keyof typeof flags) => (v: boolean) => setFlags((f) => ({ ...f, [k]: v }));

  function submit(fd: FormData) {
    start(async () => {
      const csrf = await getCsrf();
      Object.entries(flags).forEach(([k, val]) => fd.set(k, val ? "on" : ""));
      fd.set("currency", "JOD");
      const res = isEdit ? await updatePackage(initial.id!, csrf, fd) : await createPackage(csrf, fd);
      if (res.ok) { showToast(isEdit ? "Package saved" : "Package created"); setTimeout(() => router.push("/admin/packages"), 700); }
      else { setErrors(res.fieldErrors ?? {}); showToast(res.error, "danger"); }
    });
  }

  return (
    <form action={submit} style={{ display: "grid", gap: 20, maxWidth: 900 }}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <Field label="Title (English)" error={errors.titleEn}><Input name="titleEn" defaultValue={initial.titleEn} required /></Field>
        <Field label="Title (Arabic)" error={errors.titleAr}><Input name="titleAr" defaultValue={initial.titleAr} required dir="rtl" /></Field>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <Field label="Description (English)" error={errors.descriptionEn}><Textarea name="descriptionEn" defaultValue={initial.descriptionEn} required /></Field>
        <Field label="Description (Arabic)" error={errors.descriptionAr}><Textarea name="descriptionAr" defaultValue={initial.descriptionAr} required dir="rtl" /></Field>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}>
        <Field label="Slug" error={errors.slug}><Input name="slug" defaultValue={initial.slug} required /></Field>
        <Field label="Category" error={errors.categoryKey}><Select name="categoryKey" defaultValue={initial.categoryKey} required><option value="">— Select —</option>{categories.map((c) => <option key={c.key} value={c.key}>{c.titleEn}</option>)}</Select></Field>
        <Field label="Sort order" error={errors.order}><Input name="order" type="number" defaultValue={initial.order} /></Field>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}>
        <Field label="Price (fils)" error={errors.priceFils} hint="Blank = quote only"><Input name="priceFils" type="number" defaultValue={initial.priceFils ?? ""} /></Field>
        <Field label="Sale price (fils)" error={errors.salePriceFils}><Input name="salePriceFils" type="number" defaultValue={initial.salePriceFils ?? ""} /></Field>
        <Field label="Billing" error={errors.billingType}><Select name="billingType" defaultValue={initial.billingType}><option value="once">One-time</option><option value="monthly">Monthly</option><option value="custom">Custom</option></Select></Field>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(5, 1fr)" }}>
        <Field label="Platforms"><Input name="platforms" type="number" defaultValue={initial.platforms ?? ""} /></Field>
        <Field label="Posts"><Input name="posts" type="number" defaultValue={initial.posts ?? ""} /></Field>
        <Field label="Stories"><Input name="stories" type="number" defaultValue={initial.stories ?? ""} /></Field>
        <Field label="Reels"><Input name="reels" type="number" defaultValue={initial.reels ?? ""} /></Field>
        <Field label="AI videos"><Input name="aiVideos" type="number" defaultValue={initial.aiVideos ?? ""} /></Field>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}>
        <Field label="Timeline (English)"><Input name="timelineEn" defaultValue={initial.timelineEn} /></Field>
        <Field label="Timeline (Arabic)"><Input name="timelineAr" defaultValue={initial.timelineAr} dir="rtl" /></Field>
        <Field label="Status" error={errors.status}><Select name="status" defaultValue={initial.status}><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option></Select></Field>
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", padding: "8px 0" }}>
        <Toggle checked={flags.popular} onChange={setFlag("popular")} label="Popular" />
        <Toggle checked={flags.featured} onChange={setFlag("featured")} label="Featured" />
        <Toggle checked={flags.quoteOnly} onChange={setFlag("quoteOnly")} label="Quote only" />
        <Toggle checked={flags.addToCart} onChange={setFlag("addToCart")} label="Add to cart" />
        <Toggle checked={flags.buyNow} onChange={setFlag("buyNow")} label="Buy now" />
      </div>
      <div style={{ display: "flex", gap: 12, borderTop: `1px solid ${A.border}`, paddingTop: 20 }}>
        <Button type="submit" loading={pending}>{isEdit ? "Save changes" : "Create package"}</Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/packages")}>Cancel</Button>
      </div>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={clearToast} />}
    </form>
  );
}

export const EMPTY_PACKAGE: PackageFormData = { slug: "", categoryKey: "", titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "", priceFils: null, salePriceFils: null, billingType: "once", timelineEn: "", timelineAr: "", platforms: null, posts: null, stories: null, reels: null, aiVideos: null, status: "draft", order: 0, popular: false, featured: false, quoteOnly: false, addToCart: true, buyNow: true };
