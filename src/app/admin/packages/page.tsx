import Link from "next/link";
import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { PackagesTable } from "./table";

export const dynamic = "force-dynamic";
export default async function PackagesAdminPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; category?: string; page?: string; trash?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1)); const perPage = 20; const showTrash = sp.trash === "1";
  const where: Record<string, unknown> = { deletedAt: showTrash ? { not: null } : null };
  if (sp.q) where.OR = [{ titleEn: { contains: sp.q, mode: "insensitive" } }, { slug: { contains: sp.q } }];
  if (sp.status) where.status = sp.status;
  if (sp.category) where.categoryKey = sp.category;
  const [rows, total, cats] = db ? await Promise.all([
    db.package.findMany({ where, orderBy: [{ order: "asc" }, { createdAt: "desc" }], skip: (page - 1) * perPage, take: perPage }),
    db.package.count({ where }),
    db.category.findMany({ orderBy: { order: "asc" }, select: { key: true, titleEn: true } }),
  ]) : [[], 0, []];
  const packages = rows.map((p) => ({ id: p.id, slug: p.slug, titleEn: p.titleEn, titleAr: p.titleAr, status: p.status, priceFils: p.priceFils, salePriceFils: p.salePriceFils, popular: p.popular, category: p.categoryKey, deleted: Boolean(p.deletedAt) }));
  return (
    <AdminPage permission="store.read">
      <PageHeader title="Packages" subtitle={`${total} ${showTrash ? "in trash" : "package" + (total === 1 ? "" : "s")}`} action={<Link href="/admin/packages/new" className="admin-cta">New package</Link>} />
      <PackagesTable packages={packages} categories={cats} total={total} page={page} perPage={perPage} query={sp.q ?? ""} status={sp.status ?? ""} category={sp.category ?? ""} showTrash={showTrash} />
    </AdminPage>
  );
}
