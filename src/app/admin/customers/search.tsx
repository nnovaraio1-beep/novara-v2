"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/admin/ui";
export function CustomerSearch({ query }: { query: string }) {
  const router = useRouter(); const [q, setQ] = useState(query);
  return <form onSubmit={(e) => { e.preventDefault(); router.push(q ? `/admin/customers?q=${encodeURIComponent(q)}` : "/admin/customers"); }} style={{ marginBottom: 16, maxWidth: 360 }}><Input placeholder="Search customers…" value={q} onChange={(e) => setQ(e.target.value)} /></form>;
}
