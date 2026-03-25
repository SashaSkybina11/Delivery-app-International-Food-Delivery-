import { CartPageClient } from "@/components/cart/cart-page-client";
import { getCoupons } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const coupons = await getCoupons();

  return <CartPageClient coupons={coupons} />;
}
