"use server";
import { revalidatePath } from "next/cache";
import { requireDb } from "@/server/db";
import { runAction, type ActionResult } from "@/server/admin/action";
import { parse, v } from "@/lib/validate";
const schema = v.object({ name: v.string({ min: 1, max: 160 }), email: v.email(), phone: v.optional(v.string({ max: 40 })), company: v.optional(v.string({ max: 160 })), taxNumber: v.optional(v.string({ max: 60 })), status: v.literal("active", "inactive"), notes: v.optional(v.string({ max: 4000 })) });
function fromForm(fd: FormData) { const p = parse(schema, Object.fromEntries(fd.entries())); return { name: p.name, email: p.email, phone: p.phone ?? null, company: p.company ?? null, taxNumber: p.taxNumber ?? null, status: p.status, notes: p.notes ?? null }; }
export async function createCustomer(csrf: string, fd: FormData): Promise<ActionResult> {
  return runAction({ permission: "customers.write", csrf, audit: { action: "create", entityType: "customer" } }, async () => { await requireDb().customer.create({ data: fromForm(fd) }); revalidatePath("/admin/customers"); });
}
export async function updateCustomer(id: string, csrf: string, fd: FormData): Promise<ActionResult> {
  return runAction({ permission: "customers.write", csrf, audit: { action: "update", entityType: "customer", entityId: id } }, async () => { await requireDb().customer.update({ where: { id }, data: fromForm(fd) }); revalidatePath("/admin/customers"); });
}
