"use client";
import { useEffect } from "react";

/** يضبط lang و dir على وسم <html> حسب اللغة الحالية. */
export function HtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);
  return null;
}
