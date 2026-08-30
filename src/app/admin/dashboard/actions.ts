"use server";
import { redirect } from "next/navigation";
import { getSessionContext, revokeSession, clearSessionCookie } from "@/server/admin/session";
import { audit } from "@/server/admin/audit";
import { getCurrentAdmin } from "@/server/admin/auth";
import { assertCsrf } from "@/server/admin/csrf";

export async function logoutAction(csrf: string) {
  await assertCsrf(csrf);
  const admin = await getCurrentAdmin();
  const ctx = await getSessionContext();
  if (ctx) await revokeSession(ctx.sessionId);
  if (admin) await audit({ actorId: admin.id, actorEmail: admin.email, action: "logout" });
  await clearSessionCookie();
  redirect("/admin/login");
}
