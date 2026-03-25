import { ShopPageClient } from "@/components/shop/shop-page-client";
import { getCatalog } from "@/lib/db";

export default async function HomePage() {
  const initialData = await getCatalog({});

  return <ShopPageClient initialData={initialData} />;
}
