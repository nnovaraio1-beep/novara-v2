import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db, requireDb } from "@/server/db";

/**
 * جلسات العملاء (منفصلة تماماً عن جلسات الأدمن للأمان).
 * الكوكي يحمل توكن عشوائي؛ القاعدة تخزّن SHA-256 له فقط.
 * الكوكي HttpOnly + Secure + SameSite=Lax.
 */
export const CUSTOMER_COOKIE = "novara_customer_session";
const TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 يوم

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const newToken = () => randomBytes(32).toString("base64url");

export interface CustomerSessionContext { sessionId: string; customerId: string; csrfToken: string; }

export async function createCustomerSession(customerId: string, ip?: string, ua?: string): Promise<string> {
  const database = requireDb();
  const token = newToken();
  const csrfToken = newToken();
  await database.customerSession.create({
    data: { customerId, tokenHash: sha256(token), csrfToken, ipAddress: ip, userAgent: ua, expiresAt: new Date(Date.now() + TTL_MS) },
  });
  return token;
}

export async function setCustomerCookie(token: string) {
  const jar = await cookies();
  jar.set(CUSTOMER_COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
    path: "/", maxAge: TTL_MS / 1000,
  });
}

export async function clearCustomerCookie() {
  const jar = await cookies();
  jar.delete(CUSTOMER_COOKIE);
}

export async function getCustomerSession(): Promise<CustomerSessionContext | null> {
  if (!db) return null;
  const jar = await cookies();
  const token = jar.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  const session = await db.customerSession.findUnique({ where: { tokenHash: sha256(token) } });
  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;
  return { sessionId: session.id, customerId: session.customerId, csrfToken: session.csrfToken };
}

export async function revokeCustomerSession(sessionId: string) {
  await requireDb().customerSession.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
}

export function csrfMatches(expected: string, provided: string | null | undefined): boolean {
  if (!provided) return false;
  const a = Buffer.from(expected), b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}