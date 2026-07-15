"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { A, Badge, Button, Input, Select, Pagination, EmptyState, ConfirmDialog, Toast, useToast } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import { formatPrice } from "@/lib/pricing";
import { softDeleteService, restoreService, duplicateService } from "./actions";
import { getCsrf } from "@/components/admin/csrf-client";

interface Row { id: string; slug: string; titleEn: string; titleAr: string; status: string; priceFils: number | null; featured: boolean; deleted: boolean }

export function ServicesTable({ services, total, page, perPage, query, status, showTrash }: { services: Row[]; total: number; page: number; perPage: number; query: string; status: string; showTrash: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState(query);
  const [confirm, setConfirm] = useState<{ id: string; action: "delete" } | null>(null);
  const [pending, start] = useTransition();
  const { toast, showToast, clearToast } = useToast();

  const nav = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { q, status, trash: showTrash ? "1" : "", page: "1", ...patch };
    Object.entries(merged).forEach(([k, val]) => { if (val) params.set(k, val); });
    router.push(`/admin/services?${params.toString()}`);
  };

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, okMsg: string) => start(async () => {
    const res = await fn();
    if (res.ok) { showToast(okMsg); router.refresh(); } else showToast(res.error ?? "Failed", "danger");
    setConfirm(null);
  });

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <form onSubmit={(e) => { e.preventDefault(); nav({ q }); }} style={{ flex: 1, minWidth: 200 }}>
          <Input placeholder="Search services…" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <Select value={status} onChange={(e) => nav({ status: e.target.value })} style={{ maxWidth: 180 }}>
          <option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option>
        </Select>
        <Button variant="secondary" onClick={() => nav({ trash: showTrash ? "" : "1", page: "1" })}>{showTrash ? "View active" : "View trash"}</Button>
      </div>

      <DataTable<Row>
        rows={services}
        empty={<EmptyState title={showTrash ? "Trash is empty" : "No services yet"} body={showTrash ? undefined : "Create your first service to show it on the public site."} action={!showTrash && <Link href="/admin/services/new" className="admin-cta">New service</Link>} />}
        columns={[
          { key: "title", header: "Service", render: (r) => <div><Link href={`/admin/services/${r.id}`} style={{ color: A.text, fontWeight: 600, textDecoration: "none" }}>{r.titleEn}</Link><div style={{ fontSize: 12, color: A.dim, direction: "rtl" }}>{r.titleAr}</div></div> },
          { key: "slug", header: "Slug", render: (r) => <code style={{ fontSize: 12, color: A.muted }}>{r.slug}</code> },
          { key: "price", header: "Price", render: (r) => <span>{r.priceFils == null ? "Quote" : formatPrice(Math.round(r.priceFils / 1000), "en")}</span> },
          { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "published" ? "success" : r.status === "draft" ? "neutral" : r.status === "scheduled" ? "info" : "warn"}>{r.status}</Badge> },
          { key: "actions", header: "", width: "1%", render: (r) => (
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", whiteSpace: "nowrap" }}>
              {r.deleted ? <Button variant="secondary" onClick={() => run(async () => restoreService(r.id, await getCsrf()), "Service restored")}>Restore</Button> : <>
                <Link href={`/admin/services/${r.id}`}><Button variant="secondary">Edit</Button></Link>
                <Button variant="ghost" onClick={() => run(async () => duplicateService(r.id, await getCsrf()), "Service duplicated")}>Duplicate</Button>
                <Button variant="danger" onClick={() => setConfirm({ id: r.id, action: "delete" })}>Delete</Button>
              </>}
            </div>
          )},
        ]}
      />
      <Pagination page={page} pageCount={Math.ceil(total / perPage)} onPage={(p) => nav({ page: String(p) })} />

      <ConfirmDialog open={Boolean(confirm)} title="Move to trash?" body="This service will be hidden from the public site. You can restore it from the trash." confirmLabel="Move to trash" danger loading={pending}
        onCancel={() => setConfirm(null)} onConfirm={() => confirm && run(async () => softDeleteService(confirm.id, await getCsrf()), "Moved to trash")} />
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={clearToast} />}
    </>
  );
}
