"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { login } from "@/server/admin/auth";
import { databaseConfigured } from "@/server/db";
import { rateLimit } from "@/lib/rate-limit";

export interface LoginState { error?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!databaseConfigured()) return { error: "The admin database is not configured on this deployment." };

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim();
  if (!rateLimit(`admin-login:${ip}`, 10, 60_000).ok) return { error: "Too many attempts. Please wait a minute and try again." };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const result = await login(email, password, ip, h.get("user-agent") ?? undefined);
  if (!result.ok) {
    const msg = result.reason === "locked" ? "This account is temporarily locked after repeated failed attempts."
      : result.reason === "inactive" ? "This account is disabled."
      : result.reason === "not_configured" ? "The admin database is not configured."
      : "Invalid email or password.";
    return { error: msg };
  }
  redirect(result.mustChangePassword ? "/admin/dashboard?changePassword=1" : "/admin/dashboard");
}
