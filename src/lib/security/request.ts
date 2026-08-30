import { timingSafeEqual } from "node:crypto";

const MAX_JSON_BYTES = 64 * 1024;

export function siteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) {
    if (process.env.NODE_ENV === "production") throw new Error("NEXT_PUBLIC_SITE_URL is required in production.");
    return "http://localhost:3000";
  }
  return new URL(configured).origin;
}

export function hasTrustedOrigin(req: Request): boolean {
  const value = req.headers.get("origin");
  if (!value) return false;
  try { return new URL(value).origin === siteOrigin(); } catch { return false; }
}

export async function readJson(req: Request, maxBytes = MAX_JSON_BYTES): Promise<unknown> {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) throw new RequestTooLargeError();
  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > maxBytes) throw new RequestTooLargeError();
  try { return JSON.parse(raw); } catch { throw new InvalidJsonError(); }
}

export function safeInternalPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  try {
    const parsed = new URL(value, "https://internal.invalid");
    return parsed.origin === "https://internal.invalid" ? `${parsed.pathname}${parsed.search}${parsed.hash}` : fallback;
  } catch { return fallback; }
}

export function constantTimeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export class RequestTooLargeError extends Error {}
export class InvalidJsonError extends Error {}
