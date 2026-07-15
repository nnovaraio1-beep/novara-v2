import Link from "next/link";

// Root-level 404 for paths with no locale. The root layout provides <html>/<body>.
export default function GlobalNotFound() {
  return (
    <div style={{ background: "#040711", color: "#f2f5fa", fontFamily: "system-ui, sans-serif", display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", margin: 0 }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ fontSize: "96px", fontWeight: 800, margin: 0, color: "#2f6bff" }}>404</p>
        <p style={{ fontSize: "18px", color: "#b8c0cc", marginTop: "1rem" }}>This page could not be found.</p>
        <Link href="/en" style={{ display: "inline-block", marginTop: "1.5rem", padding: "12px 28px", borderRadius: "999px", background: "#2f6bff", color: "#fff", textDecoration: "none", fontWeight: 600 }}>Go home</Link>
      </div>
    </div>
  );
}
