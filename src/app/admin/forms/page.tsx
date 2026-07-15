import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { FormsTable } from "./table";
export const dynamic = "force-dynamic";
export default async function FormsPage({ searchParams }: { searchParams: Promise<{ type?: string; filter?: string; page?: string }> }) {
  const sp = await searchParams; const page = Math.max(1, Number(sp.page ?? 1)); const perPage = 25;
  const where: Record<string, unknown> = { deletedAt: null };
  if (sp.type) where.type = sp.type;
  if (sp.filter === "unread") where.isRead = false;
  if (sp.filter === "spam") where.isSpam = true;
  const [rows, total] = db ? await Promise.all([db.formSubmission.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * perPage, take: perPage }), db.formSubmission.count({ where })]) : [[], 0];
  const items = rows.map((s) => ({ id: s.id, type: s.type, data: s.data as Record<string, unknown>, isRead: s.isRead, isReplied: s.isReplied, isSpam: s.isSpam, createdAt: s.createdAt.toISOString() }));
  return <AdminPage permission="forms.read"><PageHeader title="Submissions" subtitle={`${total} submission${total === 1 ? "" : "s"}`} /><FormsTable items={items} total={total} page={page} perPage={perPage} type={sp.type ?? ""} filter={sp.filter ?? ""} /></AdminPage>;
}
