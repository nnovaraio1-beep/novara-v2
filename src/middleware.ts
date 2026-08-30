import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Public site → next-intl locale routing.
 * /admin → NO locale prefix (§1). We do a lightweight cookie presence check here
 * for a fast redirect, but the real authorization is server-side in each admin
 * route/layout (middleware can't touch the DB). Never trust this check alone.
 */
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const paymentOrigins = (process.env.CSP_PAYMENT_ORIGINS ?? "")
    .split(",").map((v) => v.trim()).filter((v) => /^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(v));
  const production = process.env.NODE_ENV === "production";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${production ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com",
    "font-src 'self' data:",
    `connect-src 'self'${paymentOrigins.length ? ` ${paymentOrigins.join(" ")}` : ""}`,
    `frame-src 'self'${paymentOrigins.length ? ` ${paymentOrigins.join(" ")}` : ""}`,
    "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
    production ? "upgrade-insecure-requests" : "",
  ].filter(Boolean).join("; ");
  // Next.js 15 extracts the framework-script nonce from the request CSP during
  // server rendering. Keep this identical to the policy sent on the response.
  requestHeaders.set("Content-Security-Policy", csp);

  const secure = (response: NextResponse) => {
    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)");
    response.headers.set("X-Frame-Options", "DENY");
    if (production) response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    return response;
  };

  if (pathname.startsWith("/admin")) {
    const hasSession = req.cookies.has("novara_admin_session");
    const isLoginRoute = pathname === "/admin/login" || pathname.startsWith("/admin/setup");
    if (!hasSession && !isLoginRoute) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return secure(NextResponse.redirect(url));
    }
    return secure(NextResponse.next({ request: { headers: requestHeaders } })); // admin pages are not locale-prefixed
  }

  const localizedRequest = new NextRequest(req, { headers: requestHeaders });
  return secure(intlMiddleware(localizedRequest));
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*", "/admin/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
