import { notFound } from "next/navigation";
import { AdminPage, PageHeader } from "@/components/admin/page-guard";
import { db } from "@/server/db";
import { formatPrice } from "@/lib/pricing";
import { A } from "@/components/admin/ui";
import { OrderStatusForm } from "./status-form";

export const dynamic = "force-dynamic";
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) notFound();
  const order = await db.order.findUnique({ where: { id }, include: { items: true, payments: true, customer: true, invoice: true } });
  if (!order) notFound();
  const jod = (fils: number) => formatPrice(Math.round(fils / 1000), "en");

  return (
    <AdminPage permission="orders.read">
      <PageHeader title={order.orderNumber} subtitle={order.email} breadcrumb={[{ label: "Orders" }, { label: order.orderNumber }]} />
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "2fr 1fr", alignItems: "start" }}>
        <div style={{ display: "grid", gap: 20 }}>
          <div style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: 14, padding: 22 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: A.text, marginTop: 0 }}>Items</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id} style={{ borderBottom: `1px solid ${A.border}` }}>
                    <td style={{ padding: "10px 0", color: A.text }}>{it.productName}<span style={{ color: A.dim }}> ×{it.quantity}</span><div style={{ fontSize: 12, color: A.dim }}>{it.kind} · {it.billingType}</div></td>
                    <td style={{ padding: "10px 0", textAlign: "end", color: A.text }}>{jod(it.lineFils)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 16, display: "grid", gap: 6, fontSize: 14 }}>
              <Row label="Subtotal" value={jod(order.subtotalFils)} />
              {order.discountFils > 0 && <Row label="Discount" value={`− ${jod(order.discountFils)}`} />}
              <Row label="Tax" value={jod(order.taxFils)} />
              <div style={{ borderTop: `1px solid ${A.border}`, marginTop: 6, paddingTop: 10 }}><Row label="Total" value={jod(order.totalFils)} bold /></div>
            </div>
          </div>
          {order.payments.length > 0 && (
            <div style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: 14, padding: 22 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: A.text, marginTop: 0 }}>Payments</h2>
              {order.payments.map((p) => <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: A.muted, padding: "6px 0" }}><span>{p.provider} · {p.status}</span><span>{jod(p.amountFils)}</span></div>)}
            </div>
          )}
        </div>
        <div style={{ display: "grid", gap: 20 }}>
          <OrderStatusForm orderId={order.id} currentStatus={order.status} internalNote={order.internalNote ?? ""} />
          <div style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: 14, padding: 22 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: A.text, marginTop: 0 }}>Customer</h2>
            <p style={{ fontSize: 14, color: A.muted, margin: "8px 0 0" }}>{order.customer?.name ?? "Guest"}<br />{order.email}</p>
            {order.customerNote && <p style={{ fontSize: 13, color: A.dim, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${A.border}` }}>Note: {order.customerNote}</p>}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: A.muted }}>{label}</span><span style={{ color: A.text, fontWeight: bold ? 700 : 400 }}>{value}</span></div>;
}
