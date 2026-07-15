import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/server/admin/auth";
import { databaseConfigured } from "@/server/db";
import { type Permission } from "@/server/admin/rbac";
import { AdminShell } from "./shell";
import { logoutAction } from "@/app/admin/dashboard/actions";
import { A } from "./ui";
import type { ReactNode } from "react";

/**
 * Wraps every admin page: server-side auth + permission gate, then renders the
 * shell. If the page requires a permission the admin lacks, they get a 403 panel
 * instead of the content — authorization is enforced here, not just in the UI.
 */
export async function AdminPage({ permission, children }: { permission?: Permission; children: ReactNode }) {
  if (!databaseConfigured()) redirect("/admin/login");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const permitted = !permission || admin.role === "super_admin" || admin.permissions.includes(permission);

  return (
    <AdminShell adminName={admin.name} adminRole={admin.role} permissions={admin.permissions} onLogout={logoutAction}>
      {permitted ? children : (
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: A.text }}>Access denied</h1>
          <p style={{ color: A.muted, marginTop: 10 }}>Your role ({admin.role}) doesn&apos;t have permission to view this page.</p>
        </div>
      )}
    </AdminShell>
  );
}

/** Page header with title + optional action slot + breadcrumbs. */
export function PageHeader({ title, subtitle, action, breadcrumb }: { title: string; subtitle?: string; action?: ReactNode; breadcrumb?: { label: string; href?: string }[] }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
      <div>
        {breadcrumb && <nav style={{ display: "flex", gap: 6, fontSize: 13, color: A.dim, marginBottom: 8 }}>{breadcrumb.map((b, i) => <span key={i}>{b.label}{i < breadcrumb.length - 1 && " / "}</span>)}</nav>}
        <h1 style={{ fontSize: 24, fontWeight: 700, color: A.text, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ color: A.muted, marginTop: 6, fontSize: 14 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
