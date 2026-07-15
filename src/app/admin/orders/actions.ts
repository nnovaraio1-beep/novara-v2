"use server";
import { revalidatePath } from "next/cache";
import { requireDb } from "@/server/db";
import { runAction, type ActionResult } from "@/server/admin/action";
import { parse, v } from "@/lib/validate";

const statusSchema = v.object({ status: v.literal("draft", "pending_payment", "confirmed", "in_review", "in_progress", "completed", "cancelled"), internalNote: v.optional(v.string({ max: 4000 })) });

export async function updateOrderStatus(id: string, csrf: string, fd: FormData): Promise<ActionResult> {
  return runAction({ permission: "orders.write", csrf, audit: { action: "order_status_change", entityType: "order", entityId: id } }, async () => {
    const db = requireDb();
    const parsed = parse(statusSchema, { status: fd.get("status"), internalNote: fd.get("internalNote") ?? undefined });
    const before = await db.order.findUnique({ where: { id } });
    await db.order.update({ where: { id }, data: { status: parsed.status, internalNote: parsed.internalNote ?? before?.internalNote } });
    revalidatePath(`/admin/orders/${id}`); revalidatePath("/admin/orders");
  });
}
