import { getSessionContext, csrfMatches } from "./session";

/** Validate a CSRF token from a form/action against the session-bound token (§31). */
export async function assertCsrf(provided: string | null | undefined): Promise<void> {
  const ctx = await getSessionContext();
  if (!ctx || !csrfMatches(ctx.csrfToken, provided)) throw new Error("CSRF validation failed.");
}
