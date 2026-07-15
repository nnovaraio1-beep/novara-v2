import type { PaymentProvider } from "../types";
/** Offline. Records intent, shows bank details, stays pending until a human reconciles. Never self-reports paid. */
export const bankTransferProvider: PaymentProvider = {
  id: "bank_transfer", supportsSubscriptions: false, isOffline: true,
  async createPaymentSession({ orderId, amountFils }) {
    return { provider: "bank_transfer", sessionId: `bank_${orderId}`, redirectUrl: null, amountFils, currency: "JOD", status: "pending" };
  },
  async verifyPayment() { throw new Error("Bank transfers are confirmed manually by an administrator."); },
  async cancelPayment() { return "cancelled"; },
  async refundPayment() { throw new Error("Bank transfer refunds are processed manually."); },
  async getPaymentStatus() { return "pending"; },
  async verifyWebhook() { throw new Error("Bank transfer has no webhook."); },
};
