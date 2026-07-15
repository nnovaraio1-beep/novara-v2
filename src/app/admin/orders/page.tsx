import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { OrdersTable } from "./table";
export const dynamic = "force-dynamic";
export default async function OrdersAdminPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const sp = await searchParams; const page = Math.max(1, Number(sp.page ?? 1)); const perPage = 25;
  const where: Record<string, unknown> = {};
  if (sp.q) where.OR = [{ orderNumber: { contains: sp.q, mode: "insensitive" } }, { email: { contains: sp.q, mode: "insensitive" } }];
  if (sp.status) where.status = sp.status;
  const [rows, total] = db ? await Promise.all([db.order.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * perPage, take: perPage }), db.order.count({ where })]) : [[], 0];
  const orders = rows.map((o) => ({ id: o.id, orderNumber: o.orderNumber, email: o.email, status: o.status, totalFils: o.totalFils, currency: o.currency, createdAt: o.createdAt.toISOString() }));
  return <AdminPage permission="orders.read"><PageHeader title="Orders" subtitle={`${total} order${total === 1 ? "" : "s"}`} /><OrdersTable orders={orders} total={total} page={page} perPage={perPage} query={sp.q ?? ""} status={sp.status ?? ""} /></AdminPage>;
}
