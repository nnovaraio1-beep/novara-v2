import type { MetadataRoute } from "next";
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nnovara.io";
export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    "/admin",
    "/api",
    ...["en", "ar"].flatMap((locale) => [
      `/${locale}/account`,
      `/${locale}/cart`,
      `/${locale}/checkout`,
      `/${locale}/order/`,
      `/${locale}/login`,
      `/${locale}/register`,
      `/${locale}/forgot-password`,
    ]),
  ];
  return {
    rules: { userAgent: "*", allow: "/", disallow: privatePaths },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
