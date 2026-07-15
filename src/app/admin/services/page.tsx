import Link from "next/link";
import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { ServicesTable } from "./table";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string; trash?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const perPage = 20;
  const showTrash = sp.trash === "1";

  const where: Record<string, unknown> = { deletedAt: showTrash ? { not: null } : null };
  if (sp.q) where.OR = [{ titleEn: { contains: sp.q, mode: "insensitive" } }, { titleAr: { contains: sp.q } }, { slug: { contains: sp.q } }];
  if (sp.status) where.status = sp.status;

  const [rows, total] = db ? await Promise.all([
    db.service.findMany({ where, orderBy: [{ order: "asc" }, { createdAt: "desc" }], skip: (page - 1) * perPage, take: perPage }),
    db.service.count({ where }),
  ]) : [[], 0];

  const services = rows.map((s) => ({ id: s.id, slug: s.slug, titleEn: s.titleEn, titleAr: s.titleAr, status: s.status, priceFils: s.priceFils, featured: s.featured, deleted: Boolean(s.deletedAt) }));

  return (
    <AdminPage permission="store.read">
      <PageHeader title="Services" subtitle={`${total} ${showTrash ? "in trash" : "service" + (total === 1 ? "" : "s")}`}
        action={<Link href="/admin/services/new" className="admin-cta">New service</Link>} />
      <ServicesTable services={services} total={total} page={page} perPage={perPage} query={sp.q ?? ""} status={sp.status ?? ""} showTrash={showTrash} />
    </AdminPage>
  );
}
