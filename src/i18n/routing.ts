import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  // "always" so /en and /ar both exist and the switcher can swap prefixes
  // while preserving the rest of the path (/ar/store/social-start ↔ /en/...).
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

/** Version-independent narrowing — avoids depending on next-intl's `hasLocale`. */
export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
