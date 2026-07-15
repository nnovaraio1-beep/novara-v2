import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { CustomerSearch } from "./search";
import { CustomersTable } from "./customers-table";
export const dynamic = "force-dynamic";
export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams; const page = Math.max(1, Number(sp.page ?? 1)); const perPage = 25;
  const where: Record<string, unknown> = {};
  if (sp.q) where.OR = [{ name: { contains: sp.q, mode: "insensitive" } }, { email: { contains: sp.q, mode: "insensitive" } }, { company: { contains: sp.q, mode: "insensitive" } }];
  const [rows, total] = db ? await Promise.all([db.customer.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * perPage, take: perPage, include: { _count: { select: { orders: true } } } }), db.customer.count({ where })]) : [[], 0];
  const customers = rows.map((c) => ({ id: c.id, name: c.name, email: c.email, company: c.company, status: c.status, orders: c._count.orders }));
  return (
    <AdminPage permission="customers.read">
      <PageHeader title="Customers" subtitle={`${total} customer${total === 1 ? "" : "s"}`} />
      <CustomerSearch query={sp.q ?? ""} />
      <CustomersTable customers={customers} page={page} pageCount={Math.ceil(total / perPage)} />
    </AdminPage>
  );
}
