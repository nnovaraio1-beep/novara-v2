import { notFound } from "next/navigation";
import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { ServiceForm } from "../form";

export const dynamic = "force-dynamic";
export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) notFound();
  const [s, categories] = await Promise.all([
    db.service.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { order: "asc" }, select: { key: true, titleEn: true } }),
  ]);
  if (!s) notFound();
  return (
    <AdminPage permission="store.write">
      <PageHeader title={s.titleEn} subtitle="Edit service" breadcrumb={[{ label: "Services" }, { label: "Edit" }]} />
      <ServiceForm categories={categories} initial={{ id: s.id, slug: s.slug, titleEn: s.titleEn, titleAr: s.titleAr, descriptionEn: s.descriptionEn, descriptionAr: s.descriptionAr, valueEn: s.valueEn ?? "", valueAr: s.valueAr ?? "", categoryKey: s.categoryKey ?? "", priceFils: s.priceFils, billingType: s.billingType, timelineEn: s.timelineEn ?? "", timelineAr: s.timelineAr ?? "", status: s.status, featured: s.featured, purchasable: s.purchasable, order: s.order }} />
    </AdminPage>
  );
}
