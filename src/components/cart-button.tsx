"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartButton() {
  const t = useTranslations("nav");
  const cart = useCart();
  return (
    <Link href="/cart" aria-label={t("cart")} className="relative grid size-11 place-items-center rounded-xl border border-[--border-hairline] text-[--color-text-muted] transition-colors hover:text-[--color-text]">
      <ShoppingBag className="size-5" aria-hidden />
      {cart.ready && cart.count > 0 && (
        <span className="absolute -end-1 -top-1 grid size-5 place-items-center rounded-full bg-[--color-brand] text-[13px] font-bold text-white">{cart.count}</span>
      )}
    </Link>
  );
}
