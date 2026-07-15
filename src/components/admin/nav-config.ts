import type { Permission } from "@/server/admin/rbac";

export interface NavItem { href: string; label: string; permission?: Permission; superOnly?: boolean }
export interface NavGroup { heading: string; items: NavItem[] }

/** Sidebar structure. Items render only if the admin holds the permission. */
export const NAV: NavGroup[] = [
  { heading: "Overview", items: [
    { href: "/admin/dashboard", label: "Dashboard" },
  ]},
  { heading: "Content", items: [
    { href: "/admin/services", label: "Services", permission: "store.read" },
    { href: "/admin/packages", label: "Packages", permission: "store.read" },
    { href: "/admin/categories", label: "Categories", permission: "store.read" },
    { href: "/admin/addons", label: "Add-ons", permission: "store.read" },
    { href: "/admin/portfolio", label: "Portfolio", permission: "content.read" },
    { href: "/admin/blog", label: "Blog", permission: "content.read" },
    { href: "/admin/legal", label: "Legal documents", permission: "content.read" },
  ]},
  { heading: "Commerce", items: [
    { href: "/admin/orders", label: "Orders", permission: "orders.read" },
    { href: "/admin/quotations", label: "Quotations", permission: "quotations.read" },
    { href: "/admin/customers", label: "Customers", permission: "customers.read" },
    { href: "/admin/coupons", label: "Coupons", permission: "store.read" },
    { href: "/admin/payments", label: "Payments", permission: "payments.manage" },
  ]},
  { heading: "Engagement", items: [
    { href: "/admin/forms", label: "Submissions", permission: "forms.read" },
    { href: "/admin/translations", label: "Translations", permission: "translations.read" },
  ]},
  { heading: "System", items: [
    { href: "/admin/settings", label: "Site settings", permission: "settings.manage" },
    { href: "/admin/users", label: "Users & roles", permission: "users.manage" },
    { href: "/admin/audit-logs", label: "Audit logs", permission: "audit.read" },
  ]},
];
