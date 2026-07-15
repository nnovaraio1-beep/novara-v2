"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Select } from "@/components/admin/ui";
export function AuditFilters({ query, action }: { query: string; action: string }) {
  const router = useRouter(); const [q, setQ] = useState(query);
  const nav = (patch: Record<string, string>) => { const p = new URLSearchParams(); Object.entries({ q, action, ...patch }).forEach(([k, val]) => { if (val) p.set(k, val); }); router.push(`/admin/audit-logs?${p}`); };
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
      <form onSubmit={(e) => { e.preventDefault(); nav({ q }); }} style={{ flex: 1, minWidth: 200 }}><Input placeholder="Search actor or entity…" value={q} onChange={(e) => setQ(e.target.value)} /></form>
      <Select value={action} onChange={(e) => nav({ action: e.target.value })} style={{ maxWidth: 200 }}><option value="">All actions</option>{["login","logout","failed_login","create","update","delete","restore","duplicate","order_status_change","role_change"].map((a) => <option key={a} value={a}>{a}</option>)}</Select>
    </div>
  );
}
