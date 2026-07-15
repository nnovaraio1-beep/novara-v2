import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation. Import Link/useRouter/usePathname from HERE, never
 * from next/link — otherwise a click drops the /en or /ar prefix and the
 * language switcher can no longer preserve the slug.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
