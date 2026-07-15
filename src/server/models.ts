import type { PaymentStatus, OrderStatus, SubscriptionStatus, ProviderId } from "@/lib/payments/types";
import type { ResolvedOrder } from "@/lib/commerce/catalog";

/**
 * Typed domain models (Phase 12). No database is connected in this phase, so
 * these are interfaces plus an in-memory repository clearly labelled as a dev
 * harness — never presented as production storage.
 */
export interface User { id: string; email: string; createdAt: string }
export interface Customer { id: string; userId: string | null; email: string; fullName: string; company?: string; phone?: string; taxNumber?: string }
export interface Address { id: string; customerId: string; country: string; city: string; line1: string; postalCode?: string }

/** OrderItem is a SNAPSHOT — an invoice issued today must not change if a price changes tomorrow. */
export interface OrderItem {
  productSlug: string; productName: string; kind: "package" | "service";
  unitFils: number; currency: "JOD"; billingType: "monthly" | "once" | "custom";
  addons: { slug: string; name: string; priceFils: number }[];
  quantity: number; discountFils: number; taxFils: number; lineFils: number;
}
export interface Order {
  id: string; orderNumber: string; customerId: string; status: OrderStatus;
  items: OrderItem[]; subtotalFils: number; discountFils: number; taxFils: number; totalFils: number;
  currency: "JOD"; couponCode?: string; notes?: string; createdAt: string;
}
export interface Payment { id: string; orderId: string; provider: ProviderId; sessionId: string; status: PaymentStatus; amountFils: number; createdAt: string }
export interface Invoice { id: string; invoiceNumber: string; orderId: string; issuedAt: string; totalFils: number; currency: "JOD"; paymentStatus: PaymentStatus; paymentMethod?: string }
export interface Quotation { id: string; customerId: string; slug: string; message?: string; status: "open" | "sent" | "won" | "lost"; createdAt: string }
export interface Coupon { code: string; percentOff?: number; amountOffFils?: number; expiresAt?: string; maxRedemptions?: number; timesRedeemed: number }
export interface Subscription { id: string; planSlug: string; customerId: string; providerSubscriptionId?: string; status: SubscriptionStatus; startedAt?: string; renewsAt?: string; currentPeriodStart?: string; currentPeriodEnd?: string; manualRenewal: boolean }

export interface OrderRecord { id: string; orderNumber: string; status: OrderStatus; email: string; resolved: ResolvedOrder; createdAt: string }
export interface PaymentRecord { id: string; orderId: string; provider: ProviderId; sessionId: string; status: PaymentStatus; amountFils: number }
