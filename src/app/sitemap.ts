import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { serviceSlugs } from "@/data/services";
import { packageSlugs } from "@/data/packages";
import { postSlugs } from "@/data/blog";
import { projectSlugs } from "@/data/portfolio";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nnovara.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "services", "store", "social-media", "portfolio", "about", "contact", "blog", "faq", "privacy", "terms", "cart"];
  const dynamic = [
    ...serviceSlugs().map((s) => `services/${s}`),
    ...packageSlugs().map((s) => `store/${s}`),
    ...postSlugs().map((s) => `blog/${s}`),
    ...projectSlugs().map((s) => `portfolio/${s}`),
  ];
  const all = [...staticPaths, ...dynamic];
  return all.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${BASE}/${locale}${path ? `/${path}` : ""}`,
      lastModified: new Date(),
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE}/${l}${path ? `/${path}` : ""}`])) },
    }))
  );
}
