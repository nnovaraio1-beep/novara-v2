import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Manrope, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"], variable: "--font-arabic", display: "swap" });

export const metadata: Metadata = {
  title: { default: "NOVARA — Technology, Creative & Digital Marketing", template: "%s · NOVARA" },
  description: "A technology, creative and digital marketing company in Amman. Strategy, creative and engineering under one team.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nnovara.io"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${manrope.variable} ${arabic.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
