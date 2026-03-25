import { CouponsPage } from "@/components/coupons/coupons-page";
import { getCoupons } from "@/lib/db";

export default async function CouponsRoutePage() {
  const coupons = await getCoupons();

  return <CouponsPage coupons={coupons} />;
}
