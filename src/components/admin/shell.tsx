"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, Search, ShieldCheck } from "lucide-react";
import { A } from "./ui";
import { NAV } from "./nav-config";

export function AdminShell({ children, adminName, adminRole, permissions, onLogout }: {
  children: React.ReactNode; adminName: string; adminRole: string; permissions: string[]; onLogout: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isSuper = adminRole === "super_admin";
  const allowed = (perm?: string) => !perm || isSuper || permissions.includes(perm);

  const sidebar = (
    <nav aria-label="Admin" style={{ display: "flex", flexDirection: "column", gap: 4, padding: 16, height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px 18px" }}>
        <ShieldCheck size={20} color={A.brand} aria-hidden /><span style={{ fontWeight: 700, color: A.text }}>NOVARA Admin</span>
      </div>
      {NAV.map((group) => {
        const items = group.items.filter((i) => allowed(i.permission));
        if (items.length === 0) return null;
        return (
          <div key={group.heading} style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.09em", textTransform: "uppercase", color: A.dim, padding: "8px 12px 4px", margin: 0 }}>{group.heading}</p>
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  style={{ display: "block", padding: "9px 12px", borderRadius: 8, fontSize: 14, fontWeight: active ? 600 : 500, color: active ? "#fff" : A.muted, background: active ? A.brand : "transparent", textDecoration: "none" }}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div style={{ minHeight: "100vh", background: A.bg, color: A.text, display: "grid", gridTemplateColumns: "260px 1fr" }} className="admin-grid">
      <aside style={{ borderInlineEnd: `1px solid ${A.border}`, background: A.surface, position: "sticky", top: 0, height: "100vh" }} className="admin-sidebar-desktop">{sidebar}</aside>
      {open && <div style={{ position: "fixed", inset: 0, zIndex: 60 }} className="admin-drawer">
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setOpen(false)} />
        <aside style={{ position: "absolute", insetInlineStart: 0, top: 0, height: "100%", width: 260, background: A.surface, borderInlineEnd: `1px solid ${A.border}` }}>{sidebar}</aside>
      </div>}
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 24px", borderBottom: `1px solid ${A.border}`, background: A.surface, position: "sticky", top: 0, zIndex: 40 }}>
          <button aria-label="Menu" onClick={() => setOpen(true)} className="admin-menu-btn" style={{ background: "none", border: "none", color: A.muted, cursor: "pointer", display: "none" }}><Menu size={20} /></button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 420 }}>
            <Search size={16} color={A.dim} aria-hidden />
            <input placeholder="Search…" aria-label="Search" style={{ flex: 1, background: "transparent", border: "none", color: A.text, fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 13, color: A.muted }}>{adminName} · {adminRole}</span>
            <button onClick={onLogout} aria-label="Sign out" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${A.border}`, color: A.muted, borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13 }}><LogOut size={14} />Sign out</button>
          </div>
        </header>
        <main style={{ padding: 24, flex: 1, minWidth: 0 }}>{children}</main>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .admin-grid { grid-template-columns: 1fr !important; }
          .admin-sidebar-desktop { display: none !important; }
          .admin-menu-btn { display: inline-flex !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
