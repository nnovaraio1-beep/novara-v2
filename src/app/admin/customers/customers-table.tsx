"use client";
import { A, Badge, EmptyState, Pagination } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import { useRouter } from "next/navigation";

interface Customer { id: string; name: string; email: string; company: string | null; status: string; orders: number }

export function CustomersTable({ customers, page, pageCount }: { customers: Customer[]; page: number; pageCount: number }) {
  const router = useRouter();
  return (
    <>
      <DataTable<Customer> rows={customers} empty={<EmptyState title="No customers yet" body="Customers who place orders or request quotes will appear here." />}
        columns={[
          { key: "name", header: "Name", render: (c) => <div><span style={{ color: A.text, fontWeight: 600 }}>{c.name}</span><div style={{ fontSize: 12, color: A.dim }}>{c.email}</div></div> },
          { key: "company", header: "Company", render: (c) => <span style={{ color: A.muted }}>{c.company ?? "—"}</span> },
          { key: "orders", header: "Orders", render: (c) => <Badge tone={c.orders > 0 ? "info" : "neutral"}>{c.orders}</Badge> },
          { key: "status", header: "Status", render: (c) => <Badge tone={c.status === "active" ? "success" : "neutral"}>{c.status}</Badge> },
        ]} />
      <Pagination page={page} pageCount={pageCount} onPage={(p) => { const u = new URLSearchParams(window.location.search); u.set("page", String(p)); router.push(`/admin/customers?${u}`); }} />
    </>
  );
}
