"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Guest cart in localStorage. Stores IDs only — the slug and add-on slugs, never
 * prices. Prices shown are recomputed from the data files at render time.
 */
const KEY = "novara-v2.cart";

export interface CartLine { slug: string; quantity: number; addons: string[]; billing: string }

interface CartState {
  lines: CartLine[]; ready: boolean; count: number;
  add(line: CartLine): void; remove(slug: string): void;
  setQuantity(slug: string, q: number): void; toggleAddon(slug: string, addon: string): void; clear(): void;
}

const Ctx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed.filter((l) => typeof l?.slug === "string"));
      }
    } catch { /* corrupt storage is not worth a crash */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* quota / private mode */ }
  }, [lines, ready]);

  const value = useMemo<CartState>(() => ({
    lines, ready, count: lines.length,
    add(line) {
      setLines((cur) => {
        const found = cur.find((l) => l.slug === line.slug);
        if (found) {
          // A monthly subscription can't be added twice.
          if (line.billing === "monthly") return cur;
          return cur.map((l) => l.slug === line.slug ? { ...l, quantity: Math.min(l.quantity + line.quantity, 20) } : l);
        }
        return [...cur, line];
      });
    },
    remove(slug) { setLines((c) => c.filter((l) => l.slug !== slug)); },
    setQuantity(slug, q) {
      setLines((c) => c.map((l) => l.slug === slug && l.billing !== "monthly" ? { ...l, quantity: Math.min(Math.max(q, 1), 20) } : l));
    },
    toggleAddon(slug, addon) {
      setLines((c) => c.map((l) => l.slug !== slug ? l : {
        ...l, addons: l.addons.includes(addon) ? l.addons.filter((a) => a !== addon) : [...l.addons, addon],
      }));
    },
    clear() { setLines([]); },
  }), [lines, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
