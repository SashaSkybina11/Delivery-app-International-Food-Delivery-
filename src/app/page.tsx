import { ShopPageClient } from "@/components/shop/shop-page-client";
import { getCatalog } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialData = await getCatalog({});

  return <ShopPageClient initialData={initialData} />;
}
