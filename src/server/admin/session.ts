import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db, requireDb } from "@/server/db";

/**
 * Sessions (§2). The cookie holds a random token; the DB stores only its SHA-256
 * hash, so a database leak cannot be replayed as a live session. Cookie is
 * HttpOnly + Secure + SameSite=Lax. CSRF token is bound to the session.
 */
export const SESSION_COOKIE = "novara_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const newToken = () => randomBytes(32).toString("base64url");

export interface SessionContext {
  sessionId: string; userId: string; csrfToken: string;
}

export async function createSession(userId: string, ip?: string, ua?: string): Promise<{ token: string; csrfToken: string }> {
  const database = requireDb();
  const token = newToken();
  const csrfToken = newToken();
  await database.session.create({
    data: { userId, tokenHash: sha256(token), csrfToken, ipAddress: ip, userAgent: ua, expiresAt: new Date(Date.now() + SESSION_TTL_MS) },
  });
  return { token, csrfToken };
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
    path: "/", maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** Resolve the current admin session from the cookie, or null. Checks expiry + revocation. */
export async function getSessionContext(): Promise<SessionContext | null> {
  if (!db) return null;
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { tokenHash: sha256(token) } });
  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;
  return { sessionId: session.id, userId: session.userId, csrfToken: session.csrfToken };
}

export async function revokeSession(sessionId: string) {
  await requireDb().session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
}

/** Logout from all devices (§2). */
export async function revokeAllSessions(userId: string) {
  await requireDb().session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
}

/** Constant-time CSRF comparison. */
export function csrfMatches(expected: string, provided: string | null | undefined): boolean {
  if (!provided) return false;
  const a = Buffer.from(expected), b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}
