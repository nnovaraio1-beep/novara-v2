import { hash, verify } from "@node-rs/argon2";

/**
 * Argon2id password hashing (§2). Parameters follow OWASP guidance
 * (memory-hard, moderate time cost). Never store or log a plaintext password.
 */
const OPTS = { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 } as const;

export function hashPassword(plain: string): Promise<string> {
  if (plain.length < 12) return Promise.reject(new Error("Password must be at least 12 characters."));
  return hash(plain, OPTS);
}

export async function verifyPassword(storedHash: string, plain: string): Promise<boolean> {
  try { return await verify(storedHash, plain, OPTS); }
  catch { return false; }
}

/** Basic strength gate — length-first, matching the register hint. */
export function passwordIssues(plain: string): string[] {
  const issues: string[] = [];
  if (plain.length < 12) issues.push("At least 12 characters.");
  if (!/[a-z]/.test(plain) || !/[A-Z]/.test(plain)) issues.push("Mix upper and lower case.");
  if (!/[0-9]/.test(plain)) issues.push("Include a number.");
  return issues;
}
