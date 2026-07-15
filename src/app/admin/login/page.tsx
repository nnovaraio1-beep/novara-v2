"use client";
import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#050816", color: "#f2f5fa", fontFamily: "system-ui, sans-serif", padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <ShieldCheck size={22} color="#148cff" aria-hidden />
          <span style={{ fontWeight: 700, fontSize: 18 }}>NOVARA Admin</span>
        </div>
        <p style={{ color: "#b8c0cc", fontSize: 14, marginBottom: 28 }}>Sign in to manage the site.</p>
        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16, background: "#080d20", border: "1px solid #1b2340", borderRadius: 16, padding: 28 }}>
          <label style={{ fontSize: 13, color: "#b8c0cc" }}>Email
            <input name="email" type="email" required autoComplete="username" style={inp} />
          </label>
          <label style={{ fontSize: 13, color: "#b8c0cc" }}>Password
            <input name="password" type="password" required autoComplete="current-password" style={inp} />
          </label>
          {state.error && <p role="alert" style={{ fontSize: 13, color: "#fca5a5", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 12px", margin: 0 }}>{state.error}</p>}
          <button type="submit" disabled={pending} style={{ height: 46, borderRadius: 999, border: "none", background: "#148cff", color: "#fff", fontWeight: 600, fontSize: 15, cursor: pending ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {pending && <Loader2 size={16} className="animate-spin" aria-hidden />}Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

const inp: React.CSSProperties = { marginTop: 6, width: "100%", height: 44, borderRadius: 8, border: "1px solid #1b2340", background: "#050816", color: "#f2f5fa", padding: "0 14px", fontSize: 15, boxSizing: "border-box" };
