"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { A, Badge, Button, Input, Select, Pagination, EmptyState } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import { formatPrice } from "@/lib/pricing";

interface Row { id: string; orderNumber: string; email: string; status: string; totalFils: number; currency: string; createdAt: string }
const statusTone = (s: string) => s === "completed" || s === "confirmed" ? "success" : s === "cancelled" ? "danger" : s === "pending_payment" ? "warn" : "neutral";

export function OrdersTable({ orders, total, page, perPage, query, status }: { orders: Row[]; total: number; page: number; perPage: number; query: string; status: string }) {
  const router = useRouter(); const [q, setQ] = useState(query);
  const nav = (patch: Record<string, string>) => { const p = new URLSearchParams(); Object.entries({ q, status, page: "1", ...patch }).forEach(([k, val]) => { if (val) p.set(k, val); }); router.push(`/admin/orders?${p}`); };
  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <form onSubmit={(e) => { e.preventDefault(); nav({ q }); }} style={{ flex: 1, minWidth: 200 }}><Input placeholder="Search order # or email…" value={q} onChange={(e) => setQ(e.target.value)} /></form>
        <Select value={status} onChange={(e) => nav({ status: e.target.value })} style={{ maxWidth: 200 }}><option value="">All statuses</option>{["draft","pending_payment","confirmed","in_review","in_progress","completed","cancelled"].map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}</Select>
      </div>
      <DataTable<Row> rows={orders} empty={<EmptyState title="No orders yet" body="Orders placed on the public site will appear here." />}
        columns={[
          { key: "num", header: "Order", render: (r) => <Link href={`/admin/orders/${r.id}`} style={{ color: A.text, fontWeight: 600, textDecoration: "none", fontFamily: "ui-monospace, monospace" }}>{r.orderNumber}</Link> },
          { key: "email", header: "Customer", render: (r) => <span style={{ color: A.muted }}>{r.email}</span> },
          { key: "total", header: "Total", render: (r) => formatPrice(Math.round(r.totalFils / 1000), "en") },
          { key: "status", header: "Status", render: (r) => <Badge tone={statusTone(r.status)}>{r.status.replace(/_/g, " ")}</Badge> },
          { key: "date", header: "Date", render: (r) => <span style={{ color: A.dim, fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString("en-GB")}</span> },
          { key: "a", header: "", width: "1%", render: (r) => <Link href={`/admin/orders/${r.id}`}><Button variant="secondary">View</Button></Link> },
        ]} />
      <Pagination page={page} pageCount={Math.ceil(total / perPage)} onPage={(p) => nav({ page: String(p) })} />
    </>
  );
}
