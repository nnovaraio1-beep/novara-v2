import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { ServiceForm, EMPTY_SERVICE } from "../form";

export const dynamic = "force-dynamic";
export default async function NewServicePage() {
  const categories = db ? await db.category.findMany({ orderBy: { order: "asc" }, select: { key: true, titleEn: true } }) : [];
  return (
    <AdminPage permission="store.write">
      <PageHeader title="New service" breadcrumb={[{ label: "Services" }, { label: "New" }]} />
      <ServiceForm initial={EMPTY_SERVICE} categories={categories} />
    </AdminPage>
  );
}
