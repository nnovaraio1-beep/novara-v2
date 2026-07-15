"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { A, Badge, Button, Input, Select, Pagination, EmptyState, ConfirmDialog, Toast, useToast } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import { formatPrice } from "@/lib/pricing";
import { softDeletePackage, restorePackage, duplicatePackage } from "./actions";
import { getCsrf } from "@/components/admin/csrf-client";

interface Row { id: string; slug: string; titleEn: string; titleAr: string; status: string; priceFils: number | null; salePriceFils: number | null; popular: boolean; category: string; deleted: boolean }

export function PackagesTable({ packages, categories, total, page, perPage, query, status, category, showTrash }: { packages: Row[]; categories: { key: string; titleEn: string }[]; total: number; page: number; perPage: number; query: string; status: string; category: string; showTrash: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState(query);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const { toast, showToast, clearToast } = useToast();
  const nav = (patch: Record<string, string>) => { const params = new URLSearchParams(); Object.entries({ q, status, category, trash: showTrash ? "1" : "", page: "1", ...patch }).forEach(([k, val]) => { if (val) params.set(k, val); }); router.push(`/admin/packages?${params}`); };
  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, okMsg: string) => start(async () => { const res = await fn(); if (res.ok) { showToast(okMsg); router.refresh(); } else showToast(res.error ?? "Failed", "danger"); setConfirm(null); });

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <form onSubmit={(e) => { e.preventDefault(); nav({ q }); }} style={{ flex: 1, minWidth: 200 }}><Input placeholder="Search packages…" value={q} onChange={(e) => setQ(e.target.value)} /></form>
        <Select value={category} onChange={(e) => nav({ category: e.target.value })} style={{ maxWidth: 200 }}><option value="">All categories</option>{categories.map((c) => <option key={c.key} value={c.key}>{c.titleEn}</option>)}</Select>
        <Select value={status} onChange={(e) => nav({ status: e.target.value })} style={{ maxWidth: 160 }}><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option></Select>
        <Button variant="secondary" onClick={() => nav({ trash: showTrash ? "" : "1" })}>{showTrash ? "View active" : "Trash"}</Button>
      </div>
      <DataTable<Row> rows={packages}
        empty={<EmptyState title={showTrash ? "Trash is empty" : "No packages yet"} body={showTrash ? undefined : "Create your first package for the store."} action={!showTrash && <Link href="/admin/packages/new" className="admin-cta">New package</Link>} />}
        columns={[
          { key: "title", header: "Package", render: (r) => <div><Link href={`/admin/packages/${r.id}`} style={{ color: A.text, fontWeight: 600, textDecoration: "none" }}>{r.titleEn}</Link>{r.popular && <span style={{ marginInlineStart: 8 }}><Badge tone="info">Popular</Badge></span>}<div style={{ fontSize: 12, color: A.dim, direction: "rtl" }}>{r.titleAr}</div></div> },
          { key: "price", header: "Price", render: (r) => r.priceFils == null ? <Badge>Quote</Badge> : <span>{r.salePriceFils ? <><s style={{ color: A.dim }}>{formatPrice(Math.round(r.priceFils / 1000), "en")}</s> {formatPrice(Math.round(r.salePriceFils / 1000), "en")}</> : formatPrice(Math.round(r.priceFils / 1000), "en")}</span> },
          { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "published" ? "success" : r.status === "draft" ? "neutral" : r.status === "scheduled" ? "info" : "warn"}>{r.status}</Badge> },
          { key: "actions", header: "", width: "1%", render: (r) => (
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", whiteSpace: "nowrap" }}>
              {r.deleted ? <Button variant="secondary" onClick={() => run(async () => restorePackage(r.id, await getCsrf()), "Restored")}>Restore</Button> : <>
                <Link href={`/admin/packages/${r.id}`}><Button variant="secondary">Edit</Button></Link>
                <Button variant="ghost" onClick={() => run(async () => duplicatePackage(r.id, await getCsrf()), "Duplicated")}>Duplicate</Button>
                <Button variant="danger" onClick={() => setConfirm(r.id)}>Delete</Button>
              </>}
            </div>
          )},
        ]}
      />
      <Pagination page={page} pageCount={Math.ceil(total / perPage)} onPage={(p) => nav({ page: String(p) })} />
      <ConfirmDialog open={Boolean(confirm)} title="Move to trash?" body="This package will be hidden from the store. You can restore it later." confirmLabel="Move to trash" danger loading={pending} onCancel={() => setConfirm(null)} onConfirm={() => confirm && run(async () => softDeletePackage(confirm, await getCsrf()), "Moved to trash")} />
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={clearToast} />}
    </>
  );
}
