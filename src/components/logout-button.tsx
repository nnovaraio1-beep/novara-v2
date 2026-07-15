"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ label }: { label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function logout() {
    setLoading(true);
    try { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }
    catch { setLoading(false); }
  }
  return (
    <button onClick={logout} disabled={loading} className="btn btn-secondary btn-md">
      <LogOut className="size-4" aria-hidden />{loading ? "…" : label}
    </button>
  );
}