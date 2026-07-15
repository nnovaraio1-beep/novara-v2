import { notFound } from "next/navigation";
import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { PackageForm } from "../form";
export const dynamic = "force-dynamic";
export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) notFound();
  const [p, categories] = await Promise.all([db.package.findUnique({ where: { id } }), db.category.findMany({ orderBy: { order: "asc" }, select: { key: true, titleEn: true } })]);
  if (!p) notFound();
  return <AdminPage permission="store.write"><PageHeader title={p.titleEn} subtitle="Edit package" breadcrumb={[{ label: "Packages" }, { label: "Edit" }]} />
    <PackageForm categories={categories} initial={{ id: p.id, slug: p.slug, categoryKey: p.categoryKey, titleEn: p.titleEn, titleAr: p.titleAr, descriptionEn: p.descriptionEn, descriptionAr: p.descriptionAr, priceFils: p.priceFils, salePriceFils: p.salePriceFils, billingType: p.billingType, timelineEn: p.timelineEn ?? "", timelineAr: p.timelineAr ?? "", platforms: p.platforms, posts: p.posts, stories: p.stories, reels: p.reels, aiVideos: p.aiVideos, status: p.status, order: p.order, popular: p.popular, featured: p.featured, quoteOnly: p.quoteOnly, addToCart: p.addToCart, buyNow: p.buyNow }} /></AdminPage>;
}
