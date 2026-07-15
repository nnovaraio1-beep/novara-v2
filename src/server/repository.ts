import type { OrderStatus, PaymentStatus, ProviderId } from "@/lib/payments/types";
import type { OrderRecord, PaymentRecord } from "./models";

/**
 * Persistence seam. ⚠️ In-memory dev harness — state does NOT survive a
 * serverless cold start. Replace `memoryRepository` with a real DB implementation
 * of this interface and nothing above this line changes.
 */
export interface Repository {
  createOrder(o: Omit<OrderRecord, "id" | "createdAt">): Promise<OrderRecord>;
  getOrder(id: string): Promise<OrderRecord | null>;
  getOrderByNumber(n: string): Promise<OrderRecord | null>;
  setOrderStatus(id: string, status: OrderStatus): Promise<void>;
  createPayment(p: Omit<PaymentRecord, "id">): Promise<PaymentRecord>;
  getPaymentBySession(provider: ProviderId, sessionId: string): Promise<PaymentRecord | null>;
  setPaymentStatus(id: string, status: PaymentStatus): Promise<void>;
  recordEventOnce(provider: ProviderId, eventId: string): Promise<boolean>;
  audit(e: { actor: string; action: string; entity: string; entityId: string; metadata?: unknown }): Promise<void>;
}

const rid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
const orders = new Map<string, OrderRecord>();
const payments = new Map<string, PaymentRecord>();
const seen = new Set<string>();

export const memoryRepository: Repository = {
  async createOrder(o) { const r = { ...o, id: rid("ord"), createdAt: new Date().toISOString() }; orders.set(r.id, r); return r; },
  async getOrder(i) { return orders.get(i) ?? null; },
  async getOrderByNumber(n) { return [...orders.values()].find((o) => o.orderNumber === n) ?? null; },
  async setOrderStatus(i, s) { const o = orders.get(i); if (o) o.status = s; },
  async createPayment(p) { const r = { ...p, id: rid("pay") }; payments.set(r.id, r); return r; },
  async getPaymentBySession(pr, sid) { return [...payments.values()].find((p) => p.provider === pr && p.sessionId === sid) ?? null; },
  async setPaymentStatus(i, s) { const p = payments.get(i); if (p) p.status = s; },
  async recordEventOnce(pr, eid) { const k = `${pr}:${eid}`; if (seen.has(k)) return false; seen.add(k); return true; },
  async audit(e) { console.info("[audit]", e.action, e.entity, e.entityId); },
};

export const repository: Repository = memoryRepository;
export const newOrderNumber = () => `ORD-${new Date().getFullYear()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
