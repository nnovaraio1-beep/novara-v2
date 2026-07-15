"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { A, Field, Input, Textarea, Select, Toggle, Button, Toast, useToast } from "@/components/admin/ui";
import { getCsrf } from "@/components/admin/csrf-client";
import { createService, updateService } from "./actions";

export interface ServiceFormData {
  id?: string; slug: string; titleEn: string; titleAr: string; descriptionEn: string; descriptionAr: string;
  valueEn: string; valueAr: string; categoryKey: string; priceFils: number | null; billingType: string;
  timelineEn: string; timelineAr: string; status: string; featured: boolean; purchasable: boolean; order: number;
}

export function ServiceForm({ initial, categories }: { initial: ServiceFormData; categories: { key: string; titleEn: string }[] }) {
  const router = useRouter();
  const [featured, setFeatured] = useState(initial.featured);
  const [purchasable, setPurchasable] = useState(initial.purchasable);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const { toast, showToast, clearToast } = useToast();
  const isEdit = Boolean(initial.id);

  function submit(formData: FormData) {
    start(async () => {
      const csrf = await getCsrf();
      formData.set("featured", featured ? "on" : "");
      formData.set("purchasable", purchasable ? "on" : "");
      const res = isEdit ? await updateService(initial.id!, csrf, formData) : await createService(csrf, formData);
      if (res.ok) { showToast(isEdit ? "Service saved" : "Service created"); setTimeout(() => router.push("/admin/services"), 700); }
      else { setErrors(res.fieldErrors ?? {}); showToast(res.error, "danger"); }
    });
  }

  return (
    <form action={submit} style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr", maxWidth: 900 }}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <Field label="Title (English)" error={errors.titleEn}><Input name="titleEn" defaultValue={initial.titleEn} required /></Field>
        <Field label="Title (Arabic)" error={errors.titleAr}><Input name="titleAr" defaultValue={initial.titleAr} required dir="rtl" /></Field>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <Field label="Short value (English)" error={errors.valueEn}><Input name="valueEn" defaultValue={initial.valueEn} /></Field>
        <Field label="Short value (Arabic)" error={errors.valueAr}><Input name="valueAr" defaultValue={initial.valueAr} dir="rtl" /></Field>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <Field label="Description (English)" error={errors.descriptionEn}><Textarea name="descriptionEn" defaultValue={initial.descriptionEn} required /></Field>
        <Field label="Description (Arabic)" error={errors.descriptionAr}><Textarea name="descriptionAr" defaultValue={initial.descriptionAr} required dir="rtl" /></Field>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}>
        <Field label="Slug" error={errors.slug} hint="URL path, lowercase"><Input name="slug" defaultValue={initial.slug} required /></Field>
        <Field label="Category" error={errors.categoryKey}><Select name="categoryKey" defaultValue={initial.categoryKey}><option value="">— None —</option>{categories.map((c) => <option key={c.key} value={c.key}>{c.titleEn}</option>)}</Select></Field>
        <Field label="Sort order" error={errors.order}><Input name="order" type="number" defaultValue={initial.order} /></Field>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}>
        <Field label="Price (fils)" error={errors.priceFils} hint="1 JOD = 1000 fils. Blank = quote."><Input name="priceFils" type="number" defaultValue={initial.priceFils ?? ""} /></Field>
        <Field label="Billing" error={errors.billingType}><Select name="billingType" defaultValue={initial.billingType}><option value="once">One-time</option><option value="monthly">Monthly</option><option value="custom">Custom</option></Select></Field>
        <Field label="Status" error={errors.status}><Select name="status" defaultValue={initial.status}><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option></Select></Field>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <Field label="Timeline (English)"><Input name="timelineEn" defaultValue={initial.timelineEn} /></Field>
        <Field label="Timeline (Arabic)"><Input name="timelineAr" defaultValue={initial.timelineAr} dir="rtl" /></Field>
      </div>
      <div style={{ display: "flex", gap: 28, padding: "8px 0" }}>
        <Toggle checked={featured} onChange={setFeatured} label="Featured" />
        <Toggle checked={purchasable} onChange={setPurchasable} label="Purchasable" />
      </div>
      <div style={{ display: "flex", gap: 12, borderTop: `1px solid ${A.border}`, paddingTop: 20 }}>
        <Button type="submit" loading={pending}>{isEdit ? "Save changes" : "Create service"}</Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/services")}>Cancel</Button>
      </div>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={clearToast} />}
    </form>
  );
}

export const EMPTY_SERVICE: ServiceFormData = { slug: "", titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "", valueEn: "", valueAr: "", categoryKey: "", priceFils: null, billingType: "once", timelineEn: "", timelineAr: "", status: "draft", featured: false, purchasable: true, order: 0 };
