import type { Prisma } from "@prisma/client";
import type { OrderStatus, PaymentStatus, ProviderId } from "@/lib/payments/types";
import type { OrderRecord, PaymentRecord } from "./models";
import type { ResolvedLine, ResolvedOrder } from "@/lib/commerce/catalog";
import { requireDb } from "./db";
import { ADDONS } from "@/data/addons";
const addonPrice = new Map(ADDONS.map((addon) => [addon.slug, addon.price * 1000]));

export interface Repository {
  createOrder(o: Omit<OrderRecord, "id" | "createdAt">): Promise<OrderRecord>;
  getOrder(id: string): Promise<OrderRecord | null>;
  getOrderByNumber(n: string): Promise<OrderRecord | null>;
  setOrderStatus(id: string, status: OrderStatus): Promise<void>;
  createPayment(p: Omit<PaymentRecord, "id">): Promise<PaymentRecord>;
  getPaymentBySession(provider: ProviderId, sessionId: string): Promise<PaymentRecord | null>;
  setPaymentStatus(id: string, status: PaymentStatus): Promise<void>;
  audit(e: { actor: string; action: string; entity: string; entityId: string; metadata?: unknown }): Promise<void>;
}

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;
function fromRow(row: OrderWithItems | null): OrderRecord | null {
  if (!row) return null;
  const lines: ResolvedLine[] = row.items.map((item) => {
    const addons = Array.isArray(item.addons) ? item.addons as { slug: string; priceFils: number }[] : [];
    return { slug: item.productSlug, kind: item.kind as "package" | "service", name: item.productName, unitFils: item.unitFils, billing: item.billingType as ResolvedLine["billing"], quantity: item.quantity, addonSlugs: addons.map((a) => a.slug), addonsFils: addons.reduce((sum, a) => sum + a.priceFils, 0), lineFils: item.lineFils };
  });
  const resolved: ResolvedOrder = { lines, subtotalFils: row.subtotalFils, discountFils: row.discountFils, taxFils: row.taxFils, totalFils: row.totalFils, currency: "JOD", requiresQuote: lines.some((line) => line.billing === "custom"), hasSubscription: lines.some((line) => line.billing === "monthly") };
  return { id: row.id, orderNumber: row.orderNumber, status: row.status as OrderStatus, email: row.email, resolved, createdAt: row.createdAt.toISOString() };
}

export const repository: Repository = {
  async createOrder(order) {
    const created = await requireDb().order.create({ data: {
      orderNumber: order.orderNumber, status: order.status, email: order.email,
      subtotalFils: order.resolved.subtotalFils, discountFils: order.resolved.discountFils,
      taxFils: order.resolved.taxFils, totalFils: order.resolved.totalFils, currency: order.resolved.currency,
      items: { create: order.resolved.lines.map((line) => ({
        productSlug: line.slug, productName: line.name, kind: line.kind, unitFils: line.unitFils ?? 0,
        billingType: line.billing, quantity: line.quantity,
        addons: line.addonSlugs.map((slug) => ({ slug, priceFils: addonPrice.get(slug) ?? 0 })), lineFils: line.lineFils,
      })) },
    }, include: { items: true } });
    return fromRow(created)!;
  },
  async getOrder(id) { return fromRow(await requireDb().order.findUnique({ where: { id }, include: { items: true } })); },
  async getOrderByNumber(orderNumber) { return fromRow(await requireDb().order.findUnique({ where: { orderNumber }, include: { items: true } })); },
  async setOrderStatus(id, status) { await requireDb().order.update({ where: { id }, data: { status } }); },
  async createPayment(payment) { const row = await requireDb().payment.create({ data: payment }); return { ...row, provider: row.provider as ProviderId, status: row.status as PaymentStatus }; },
  async getPaymentBySession(provider, sessionId) { const row = await requireDb().payment.findUnique({ where: { provider_sessionId: { provider, sessionId } } }); return row ? { ...row, provider: row.provider as ProviderId, status: row.status as PaymentStatus } : null; },
  async setPaymentStatus(id, status) { await requireDb().payment.update({ where: { id }, data: { status } }); },
  async audit(event) {
    const [kind, email] = event.actor.split(":", 2);
    await requireDb().auditLog.create({ data: { actorEmail: kind === "guest" ? email : undefined, action: event.action, entityType: event.entity, entityId: event.entityId, after: event.metadata === undefined ? undefined : JSON.parse(JSON.stringify(event.metadata)) } });
  },
};

export const newOrderNumber = () => `ORD-${new Date().getFullYear()}-${crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase()}`;
