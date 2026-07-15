"use server";
import { redirect } from "next/navigation";
import { getSessionContext, revokeSession, clearSessionCookie } from "@/server/admin/session";
import { audit } from "@/server/admin/audit";
import { getCurrentAdmin } from "@/server/admin/auth";

export async function logoutAction() {
  const admin = await getCurrentAdmin();
  const ctx = await getSessionContext();
  if (ctx) await revokeSession(ctx.sessionId);
  if (admin) await audit({ actorId: admin.id, actorEmail: admin.email, action: "logout" });
  await clearSessionCookie();
  redirect("/admin/login");
}
