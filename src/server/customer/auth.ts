import { requireDb, db } from "@/server/db";
import { hashPassword, verifyPassword, passwordIssues } from "@/server/admin/password";
import { createCustomerSession, setCustomerCookie, getCustomerSession, clearCustomerCookie, revokeCustomerSession } from "./session";

/** ثوابت رسائل موحّدة (ما نكشف إذا الإيميل موجود أو لأ — للأمان). */
const GENERIC_LOGIN_ERROR = "Invalid email or password.";

export interface AuthResult { ok: boolean; error?: string; fieldErrors?: Record<string, string>; }

/** تسجيل عميل جديد. */
export async function registerCustomer(input: { name: string; email: string; password: string; locale?: string; ip?: string; ua?: string }): Promise<AuthResult> {
  const database = requireDb();
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fieldErrors.email = "Enter a valid email.";
  const pwIssues = passwordIssues(input.password);
  if (pwIssues.length) fieldErrors.password = pwIssues.join(" ");
  if (Object.keys(fieldErrors).length) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };

  const existing = await database.customer.findUnique({ where: { email } });
  if (existing) return { ok: false, fieldErrors: { email: "An account with this email already exists." } };

  const passwordHash = await hashPassword(input.password);
  const customer = await database.customer.create({
    data: { name, email, passwordHash, locale: input.locale ?? "en", status: "active" },
  });

  const token = await createCustomerSession(customer.id, input.ip, input.ua);
  await setCustomerCookie(token);
  return { ok: true };
}

/** تسجيل دخول عميل. رسالة خطأ موحّدة سواء الإيميل غلط أو الباسورد. */
export async function loginCustomer(input: { email: string; password: string; ip?: string; ua?: string }): Promise<AuthResult> {
  const database = requireDb();
  const email = input.email.trim().toLowerCase();

  const customer = await database.customer.findUnique({ where: { email } });
  const hash = customer?.passwordHash ?? "$argon2id$v=19$m=19456,t=2,p=1$aaaaaaaaaaaaaaaaaaaaaa$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const valid = await verifyPassword(hash, input.password);

  if (!customer || !customer.passwordHash || !valid) return { ok: false, error: GENERIC_LOGIN_ERROR };
  if (customer.status !== "active") return { ok: false, error: "This account is not active." };

  const token = await createCustomerSession(customer.id, input.ip, input.ua);
  await setCustomerCookie(token);
  return { ok: true };
}

/** تسجيل خروج. */
export async function logoutCustomer(): Promise<void> {
  const ctx = await getCustomerSession();
  if (ctx) await revokeCustomerSession(ctx.sessionId);
  await clearCustomerCookie();
}

/** جلب العميل الحالي (أو null). */
export async function getCurrentCustomer() {
  if (!db) return null;
  const ctx = await getCustomerSession();
  if (!ctx) return null;
  const customer = await db.customer.findUnique({
    where: { id: ctx.customerId },
    select: { id: true, name: true, email: true, phone: true, company: true, taxNumber: true, locale: true },
  });
  return customer;
}

/** تحديث بيانات العميل (الاسم، التلفون، الشركة، الرقم الضريبي). */
export async function updateCustomerProfile(input: { name?: string; phone?: string; company?: string; taxNumber?: string }): Promise<AuthResult> {
  const ctx = await getCustomerSession();
  if (!ctx) return { ok: false, error: "Not signed in." };
  const database = requireDb();

  const fieldErrors: Record<string, string> = {};
  const name = input.name?.trim();
  if (name !== undefined && name.length < 2) fieldErrors.name = "Please enter your name.";
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

  await database.customer.update({
    where: { id: ctx.customerId },
    data: {
      ...(name ? { name } : {}),
      phone: input.phone?.trim() || null,
      company: input.company?.trim() || null,
      taxNumber: input.taxNumber?.trim() || null,
    },
  });
  return { ok: true };
}
