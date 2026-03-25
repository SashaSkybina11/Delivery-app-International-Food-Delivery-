import { CartPageClient } from "@/components/cart/cart-page-client";
import { getCoupons } from "@/lib/db";

export default async function CartPage() {
  const coupons = await getCoupons();

  return <CartPageClient coupons={coupons} />;
}
