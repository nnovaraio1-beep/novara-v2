import { createHmac } from "node:crypto";
import { constantTimeEqual } from "./request";

function secret() {
  const value = process.env.ORDER_ACCESS_SECRET ?? process.env.AUTH_SECRET;
  if (!value && process.env.NODE_ENV === "production") throw new Error("ORDER_ACCESS_SECRET or AUTH_SECRET is required in production.");
  return value ?? "development-only-order-access-secret";
}
export function orderAccessToken(orderNumber: string) { return createHmac("sha256", secret()).update(`order:${orderNumber}`).digest("base64url"); }
export function validOrderAccess(orderNumber: string, token: string | null) { return Boolean(token) && constantTimeEqual(orderAccessToken(orderNumber), token!); }
