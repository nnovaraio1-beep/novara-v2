import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
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

  if (pathname.startsWith("/admin")) {
    const hasSession = req.cookies.has("novara_admin_session");
    const isLoginRoute = pathname === "/admin/login" || pathname.startsWith("/admin/setup");
    if (!hasSession && !isLoginRoute) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next(); // admin pages are not locale-prefixed
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*", "/admin/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
