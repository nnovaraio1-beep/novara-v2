"use client";
import { A, Badge, EmptyState, Pagination } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import { useRouter } from "next/navigation";

interface Log { id: string; action: string; actorEmail: string | null; entityType: string | null; entityId: string | null; ip: string | null; createdAt: string }

export function AuditTable({ logs, page, pageCount }: { logs: Log[]; page: number; pageCount: number }) {
  const router = useRouter();
  return (
    <>
      <DataTable<Log> rows={logs} empty={<EmptyState title="No audit events" body="Sensitive actions (logins, edits, deletes, role changes) are recorded here." />}
        columns={[
          { key: "action", header: "Action", render: (l) => <Badge tone={l.action.includes("delete") ? "danger" : l.action.includes("login") ? "info" : "neutral"}>{l.action}</Badge> },
          { key: "actor", header: "Actor", render: (l) => <span style={{ color: A.muted }}>{l.actorEmail ?? "system"}</span> },
          { key: "entity", header: "Entity", render: (l) => l.entityType ? <span style={{ color: A.muted, fontSize: 13 }}>{l.entityType}{l.entityId ? `:${l.entityId.slice(0, 8)}` : ""}</span> : "—" },
          { key: "ip", header: "IP", render: (l) => <span style={{ color: A.dim, fontSize: 13, fontFamily: "ui-monospace, monospace" }}>{l.ip ?? "—"}</span> },
          { key: "date", header: "When", render: (l) => <span style={{ color: A.dim, fontSize: 13 }}>{new Date(l.createdAt).toLocaleString("en-GB")}</span> },
        ]} />
      <Pagination page={page} pageCount={pageCount} onPage={(p) => { const u = new URLSearchParams(window.location.search); u.set("page", String(p)); router.push(`/admin/audit-logs?${u}`); }} />
    </>
  );
}
