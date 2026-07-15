"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { A, Badge, Button, Select, Pagination, EmptyState, Toast, useToast } from "@/components/admin/ui";
import { getCsrf } from "@/components/admin/csrf-client";
import { markRead, markReplied, markSpam, softDeleteSubmission } from "./actions";

interface Item { id: string; type: string; data: Record<string, unknown>; isRead: boolean; isReplied: boolean; isSpam: boolean; createdAt: string }
export function FormsTable({ items, total, page, perPage, type, filter }: { items: Item[]; total: number; page: number; perPage: number; type: string; filter: string }) {
  const router = useRouter(); const [pending, start] = useTransition(); const { toast, showToast, clearToast } = useToast(); const [openId, setOpenId] = useState<string | null>(null);
  const nav = (patch: Record<string, string>) => { const p = new URLSearchParams(); Object.entries({ type, filter, ...patch }).forEach(([k, val]) => { if (val) p.set(k, val); }); router.push(`/admin/forms?${p}`); };
  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, msg: string) => start(async () => { const r = await fn(); if (r.ok) { showToast(msg); router.refresh(); } else showToast(r.error ?? "Failed", "danger"); });
  return (
    <>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <Select value={type} onChange={(e) => nav({ type: e.target.value })} style={{ maxWidth: 180 }}><option value="">All types</option>{["contact","project","quote","support","newsletter"].map((t) => <option key={t} value={t}>{t}</option>)}</Select>
        <Select value={filter} onChange={(e) => nav({ filter: e.target.value })} style={{ maxWidth: 160 }}><option value="">All</option><option value="unread">Unread</option><option value="spam">Spam</option></Select>
      </div>
      {items.length === 0 ? <EmptyState title="No submissions" body="Form submissions from the public site will appear here." /> : (
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((it) => (
            <div key={it.id} style={{ background: A.surface, border: `1px solid ${it.isRead ? A.border : A.brand + "66"}`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Badge tone="info">{it.type}</Badge>
                  {!it.isRead && <Badge tone="warn">Unread</Badge>}
                  {it.isReplied && <Badge tone="success">Replied</Badge>}
                  {it.isSpam && <Badge tone="danger">Spam</Badge>}
                  <span style={{ color: A.muted, fontSize: 14 }}>{String(it.data.email ?? it.data.name ?? "—")}</span>
                </div>
                <span style={{ color: A.dim, fontSize: 13 }}>{new Date(it.createdAt).toLocaleString("en-GB")}</span>
              </div>
              <button onClick={() => setOpenId(openId === it.id ? null : it.id)} style={{ marginTop: 10, background: "none", border: "none", color: A.brand, cursor: "pointer", fontSize: 13, padding: 0 }}>{openId === it.id ? "Hide" : "View"} details</button>
              {openId === it.id && <div style={{ marginTop: 10, padding: 12, background: A.bg, borderRadius: 8, fontSize: 13, color: A.muted }}>{Object.entries(it.data).map(([k, val]) => <div key={k} style={{ padding: "3px 0" }}><span style={{ color: A.dim }}>{k}:</span> {String(val)}</div>)}</div>}
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {!it.isRead && <Button variant="secondary" onClick={() => run(async () => markRead(it.id, await getCsrf()), "Marked read")}>Mark read</Button>}
                {!it.isReplied && <Button variant="secondary" onClick={() => run(async () => markReplied(it.id, await getCsrf()), "Marked replied")}>Mark replied</Button>}
                {!it.isSpam && <Button variant="ghost" onClick={() => run(async () => markSpam(it.id, await getCsrf()), "Marked spam")}>Spam</Button>}
                <Button variant="danger" onClick={() => run(async () => softDeleteSubmission(it.id, await getCsrf()), "Deleted")}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination page={page} pageCount={Math.ceil(total / perPage)} onPage={(p) => nav({ page: String(p) })} />
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={clearToast} />}
    </>
  );
}
