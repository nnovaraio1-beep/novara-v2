"use server";
import { revalidatePath } from "next/cache";
import { requireDb } from "@/server/db";
import { runAction, type ActionResult } from "@/server/admin/action";

async function flag(id: string, csrf: string, data: Record<string, unknown>, action: string): Promise<ActionResult> {
  return runAction({ permission: "forms.write", csrf, audit: { action, entityType: "submission", entityId: id } }, async () => {
    await requireDb().formSubmission.update({ where: { id }, data }); revalidatePath("/admin/forms");
  });
}
export const markRead = async (id: string, csrf: string) =>
  await flag(id, csrf, { isRead: true }, "submission_read");

export const markReplied = async (id: string, csrf: string) =>
  await flag(
    id,
    csrf,
    { isReplied: true, isRead: true },
    "submission_replied"
  );

export const markSpam = async (id: string, csrf: string) =>
  await flag(id, csrf, { isSpam: true }, "submission_spam");

export const softDeleteSubmission = async (id: string, csrf: string) =>
  await flag(
    id,
    csrf,
    { deletedAt: new Date() },
    "submission_delete"
  );

export const restoreSubmission = async (id: string, csrf: string) =>
  await flag(id, csrf, { deletedAt: null }, "submission_restore");