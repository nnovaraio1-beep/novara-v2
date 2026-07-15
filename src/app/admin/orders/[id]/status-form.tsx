"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { A, Field, Select, Textarea, Button, Toast, useToast } from "@/components/admin/ui";
import { getCsrf } from "@/components/admin/csrf-client";
import { updateOrderStatus } from "../actions";

const STATUSES = ["draft", "pending_payment", "confirmed", "in_review", "in_progress", "completed", "cancelled"];

export function OrderStatusForm({ orderId, currentStatus, internalNote }: { orderId: string; currentStatus: string; internalNote: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const { toast, showToast, clearToast } = useToast();
  function submit(fd: FormData) {
    start(async () => {
      const res = await updateOrderStatus(orderId, await getCsrf(), fd);
      if (res.ok) { showToast("Order updated"); router.refresh(); } else showToast(res.error, "danger");
    });
  }
  return (
    <form action={submit} style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: 14, padding: 22, display: "grid", gap: 14 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: A.text, margin: 0 }}>Status</h2>
      <Field label="Order status"><Select name="status" defaultValue={currentStatus}>{STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}</Select></Field>
      <Field label="Internal note" hint="Not visible to the customer"><Textarea name="internalNote" defaultValue={internalNote} /></Field>
      <Button type="submit" loading={pending}>Update order</Button>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={clearToast} />}
    </form>
  );
}
