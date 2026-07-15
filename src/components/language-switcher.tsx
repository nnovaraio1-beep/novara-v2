"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Languages } from "lucide-react";

/**
 * Swaps the locale while keeping the current path — usePathname from
 * next-intl navigation returns the path WITHOUT the locale prefix, so pushing
 * it under the other locale preserves the slug (/ar/store/x ↔ /en/store/x).
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const other = locale === "ar" ? "en" : "ar";
  const label = other === "ar" ? "العربية" : "English";

  return (
    <button
      onClick={() => router.replace(pathname, { locale: other })}
      className="inline-flex items-center gap-2 rounded-xl border border-[--border-hairline] px-3.5 py-2.5 text-[14px] font-medium text-[--color-text-muted] transition-colors hover:text-[--color-text]"
      aria-label={label}
    >
      <Languages className="size-4" aria-hidden />
      <span>{label}</span>
    </button>
  );
}
