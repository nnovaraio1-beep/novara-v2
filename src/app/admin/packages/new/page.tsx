import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { PackageForm, EMPTY_PACKAGE } from "../form";
export const dynamic = "force-dynamic";
export default async function NewPackagePage() {
  const categories = db ? await db.category.findMany({ orderBy: { order: "asc" }, select: { key: true, titleEn: true } }) : [];
  return <AdminPage permission="store.write"><PageHeader title="New package" breadcrumb={[{ label: "Packages" }, { label: "New" }]} /><PackageForm initial={EMPTY_PACKAGE} categories={categories} /></AdminPage>;
}
