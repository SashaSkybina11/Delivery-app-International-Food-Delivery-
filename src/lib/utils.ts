import { AppliedCoupon } from "@/lib/types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function getDiscountAmount(subtotal: number, coupon: AppliedCoupon | null) {
  if (!coupon || subtotal < coupon.minOrder) {
    return 0;
  }

  if (coupon.discountType === "percent") {
    return Number(((subtotal * coupon.discountValue) / 100).toFixed(2));
  }

  return Math.min(subtotal, coupon.discountValue);
}

export function shopAccentStyle(accent: string) {
  const accents: Record<string, string> = {
    gold: "linear-gradient(135deg, #ffd400 0%, #fff7bf 58%, #ffffff 100%)",
    onyx: "linear-gradient(135deg, #ffe56b 0%, #ffffff 72%, #f1f1f1 100%)",
    linen: "linear-gradient(135deg, #ffffff 0%, #fff1a6 100%)",
  };

  return accents[accent] ?? accents.gold;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatShopName(name: string) {
  return `"${name}"`;
}
