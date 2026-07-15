import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/server/admin/auth";
import { databaseConfigured, db } from "@/server/db";
import { AdminShell } from "@/components/admin/shell";
import { A, Badge } from "@/components/admin/ui";
import { logoutAction } from "./actions";
import { formatPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!databaseConfigured()) redirect("/admin/login");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const [orders, pendingQuotes, customers, unreadForms, revenueAgg, recentOrders, recentForms] = db ? await Promise.all([
    db.order.count(),
    db.quotation.count({ where: { status: "open" } }),
    db.customer.count(),
    db.formSubmission.count({ where: { isRead: false, deletedAt: null } }),
    db.order.aggregate({ _sum: { totalFils: true }, where: { status: { in: ["confirmed", "completed"] } } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.formSubmission.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]) : [0, 0, 0, 0, { _sum: { totalFils: null } }, [], []];

  const revenueFils = revenueAgg._sum.totalFils ?? 0;
  const stats = [
    { label: "Total orders", value: String(orders), href: "/admin/orders" },
    { label: "Revenue (confirmed)", value: formatPrice(Math.round(revenueFils / 1000), "en"), href: "/admin/orders" },
    { label: "Pending quotations", value: String(pendingQuotes), href: "/admin/quotations" },
    { label: "Customers", value: String(customers), href: "/admin/customers" },
    { label: "Unread submissions", value: String(unreadForms), href: "/admin/forms" },
  ];

  return (
    <AdminShell adminName={admin.name} adminRole={admin.role} permissions={admin.permissions} onLogout={logoutAction}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: A.text, margin: 0 }}>Dashboard</h1>
      <p style={{ color: A.muted, marginTop: 6, fontSize: 14 }}>Welcome back, {admin.name}.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginTop: 24 }}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <div style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: 14, padding: 20 }}>
              <p style={{ fontSize: 12, color: A.dim, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0 }}>{s.label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, margin: "10px 0 0", color: A.text }}>{s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }} className="admin-dash-cols">
        <Panel title="Recent orders" href="/admin/orders">
          {recentOrders.length === 0 ? <Empty text="No orders yet" /> : recentOrders.map((o) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${A.border}`, textDecoration: "none", color: A.text, fontSize: 14 }}>
              <span style={{ fontFamily: "ui-monospace, monospace" }}>{o.orderNumber}</span>
              <span style={{ display: "flex", gap: 10, alignItems: "center" }}><Badge tone={o.status === "completed" || o.status === "confirmed" ? "success" : o.status === "cancelled" ? "danger" : "neutral"}>{o.status.replace(/_/g, " ")}</Badge>{formatPrice(Math.round(o.totalFils / 1000), "en")}</span>
            </Link>
          ))}
        </Panel>
        <Panel title="Recent submissions" href="/admin/forms">
          {recentForms.length === 0 ? <Empty text="No submissions yet" /> : recentForms.map((f) => (
            <div key={f.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${A.border}`, fontSize: 14, color: A.muted }}>
              <span><Badge tone="info">{f.type}</Badge> {String((f.data as Record<string, unknown>).email ?? "—")}</span>
              {!f.isRead && <Badge tone="warn">New</Badge>}
            </div>
          ))}
        </Panel>
      </div>
      <style>{`@media (max-width: 800px){ .admin-dash-cols{ grid-template-columns:1fr !important; } }`}</style>
    </AdminShell>
  );
}

function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <div style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: 14, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: A.text, margin: 0 }}>{title}</h2>
        <Link href={href} style={{ fontSize: 13, color: A.brand, textDecoration: "none" }}>View all</Link>
      </div>
      {children}
    </div>
  );
}
function Empty({ text }: { text: string }) { return <p style={{ color: A.dim, fontSize: 14, padding: "20px 0", textAlign: "center" }}>{text}</p>; }
