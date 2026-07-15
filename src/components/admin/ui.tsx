"use client";
import { useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";

/* Design tokens local to admin — dark SaaS palette, not the public site's. */
export const A = {
  bg: "#0a0e1a", surface: "#111726", surface2: "#161d30", border: "#232c44",
  borderStrong: "#334063", text: "#e8ecf4", muted: "#9aa5bd", dim: "#6b7590",
  brand: "#3b82f6", brandDim: "#1d4ed8", danger: "#ef4444", success: "#22c55e", warn: "#f59e0b",
};

export function Button({ variant = "primary", loading, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost"; loading?: boolean }) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: A.brand, color: "#fff", border: "none" },
    secondary: { background: A.surface2, color: A.text, border: `1px solid ${A.border}` },
    danger: { background: "transparent", color: A.danger, border: `1px solid ${A.danger}55` },
    ghost: { background: "transparent", color: A.muted, border: "none" },
  };
  return (
    <button {...props} disabled={props.disabled || loading}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, height: 38, padding: "0 16px", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: loading ? "wait" : "pointer", opacity: props.disabled ? 0.5 : 1, ...styles[variant], ...props.style }}>
      {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} aria-hidden />}{children}
    </button>
  );
}

export function Field({ label, error, children, hint }: { label: string; error?: string; children: ReactNode; hint?: string }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 13, color: A.muted, fontWeight: 500 }}>{label}</span>
      <div style={{ marginTop: 6 }}>{children}</div>
      {hint && !error && <span style={{ fontSize: 12, color: A.dim, marginTop: 4, display: "block" }}>{hint}</span>}
      {error && <span role="alert" style={{ fontSize: 12, color: A.danger, marginTop: 4, display: "block" }}>{error}</span>}
    </label>
  );
}

export const inputStyle: React.CSSProperties = { width: "100%", minHeight: 40, borderRadius: 8, border: `1px solid ${A.border}`, background: A.bg, color: A.text, padding: "9px 12px", fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" };

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} style={{ ...inputStyle, ...props.style }} />; }
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} style={{ ...inputStyle, minHeight: 90, resize: "vertical", ...props.style }} />; }
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} style={{ ...inputStyle, ...props.style }} />; }

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", border: "none", cursor: "pointer", color: A.text, fontSize: 14 }}>
      <span style={{ width: 40, height: 23, borderRadius: 999, background: checked ? A.brand : A.border, position: "relative", transition: "background .2s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 2, insetInlineStart: checked ? 19 : 2, width: 19, height: 19, borderRadius: "50%", background: "#fff", transition: "inset-inline-start .2s" }} />
      </span>{label}
    </button>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warn" | "danger" | "info" }) {
  const tones = { neutral: [A.dim, `${A.dim}22`], success: [A.success, `${A.success}22`], warn: [A.warn, `${A.warn}22`], danger: [A.danger, `${A.danger}22`], info: [A.brand, `${A.brand}22`] };
  const [c, bg] = tones[tone];
  return <span style={{ fontSize: 12, fontWeight: 600, color: c, background: bg, padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>{children}</span>;
}

export function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: 14, ...style }}>{children}</div>;
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 24px", color: A.muted }}>
      <p style={{ fontSize: 17, fontWeight: 600, color: A.text }}>{title}</p>
      {body && <p style={{ marginTop: 8, fontSize: 14, maxWidth: 380, marginInline: "auto" }}>{body}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}

export function Toast({ message, tone = "success", onClose }: { message: string; tone?: "success" | "danger"; onClose: () => void }) {
  return (
    <div role="status" style={{ position: "fixed", insetInlineEnd: 24, bottom: 24, zIndex: 100, display: "flex", alignItems: "center", gap: 12, background: A.surface2, border: `1px solid ${tone === "success" ? A.success : A.danger}55`, borderRadius: 10, padding: "12px 16px", color: A.text, fontSize: 14, maxWidth: 380, boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} aria-label="Dismiss" style={{ background: "none", border: "none", color: A.dim, cursor: "pointer" }}><X size={16} /></button>
    </div>
  );
}

export function ConfirmDialog({ open, title, body, confirmLabel = "Confirm", danger, onConfirm, onCancel, loading }: { open: boolean; title: string; body?: string; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onCancel: () => void; loading?: boolean }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 90, display: "grid", placeItems: "center", background: "rgba(0,0,0,0.6)", padding: 20 }} onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: 14, padding: 26, maxWidth: 420, width: "100%" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: A.text, margin: 0 }}>{title}</h2>
        {body && <p style={{ fontSize: 14, color: A.muted, marginTop: 10, lineHeight: 1.6 }}>{body}</p>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export function Pagination({ page, pageCount, onPage }: { page: number; pageCount: number; onPage: (p: number) => void }) {
  if (pageCount <= 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20 }}>
      <Button variant="secondary" onClick={() => onPage(page - 1)} disabled={page <= 1}><ChevronLeft size={16} className="flip-rtl" /></Button>
      <span style={{ fontSize: 14, color: A.muted }}>Page {page} of {pageCount}</span>
      <Button variant="secondary" onClick={() => onPage(page + 1)} disabled={page >= pageCount}><ChevronRight size={16} className="flip-rtl" /></Button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; tone: "success" | "danger" } | null>(null);
  return { toast, showToast: (message: string, tone: "success" | "danger" = "success") => setToast({ message, tone }), clearToast: () => setToast(null) };
}
