"use client";
let cached: string | null = null;
/** Fetch (and cache) the session CSRF token for passing into server actions. */
export async function getCsrf(): Promise<string> {
  if (cached) return cached;
  const res = await fetch("/admin/api/csrf", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not get CSRF token");
  const { csrf } = await res.json();
  cached = csrf;
  return csrf;
}
