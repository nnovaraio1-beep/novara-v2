import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { AuditFilters } from "./filters";
import { AuditTable } from "./audit-table";
export const dynamic = "force-dynamic";
export default async function AuditLogsPage({ searchParams }: { searchParams: Promise<{ action?: string; q?: string; page?: string }> }) {
  const sp = await searchParams; const page = Math.max(1, Number(sp.page ?? 1)); const perPage = 40;
  const where: Record<string, unknown> = {};
  if (sp.action) where.action = sp.action;
  if (sp.q) where.OR = [{ actorEmail: { contains: sp.q, mode: "insensitive" } }, { entityType: { contains: sp.q } }, { entityId: { contains: sp.q } }];
  const [rows, total] = db ? await Promise.all([db.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * perPage, take: perPage }), db.auditLog.count({ where })]) : [[], 0];
  const logs = rows.map((l) => ({ id: l.id, action: l.action, actorEmail: l.actorEmail, entityType: l.entityType, entityId: l.entityId, ip: l.ipAddress, createdAt: l.createdAt.toISOString() }));
  return (
    <AdminPage permission="audit.read">
      <PageHeader title="Audit logs" subtitle={`${total} event${total === 1 ? "" : "s"} · immutable record of sensitive actions`} />
      <AuditFilters query={sp.q ?? ""} action={sp.action ?? ""} />
      <AuditTable logs={logs} page={page} pageCount={Math.ceil(total / perPage)} />
    </AdminPage>
  );
}
