import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nnovara.io";

/** Build page metadata (title/description + hreflang alternates) from a namespace with title+subtitle keys. */
export async function pageMetadata(locale: Locale, namespace: string, path: string, keys = { title: "title", desc: "subtitle" }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const url = `${BASE}/${locale}${path ? `/${path}` : ""}`;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${BASE}/${l}${path ? `/${path}` : ""}`]));
  const title = t(keys.title);
  const description = t(keys.desc);
  return {
    title, description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url, siteName: "NOVARA", locale, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Metadata for a single item (service/package/post/project) detail page. */
export function itemMetadata(locale: Locale, path: string, title: string, description: string, image?: string): Metadata {
  const url = `${BASE}/${locale}${path ? `/${path}` : ""}`;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${BASE}/${l}${path ? `/${path}` : ""}`]));
  return {
    title, description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url, siteName: "NOVARA", locale, type: "article", images: image ? [{ url: `${BASE}${image}` }] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [`${BASE}${image}`] : undefined },
  };
}
