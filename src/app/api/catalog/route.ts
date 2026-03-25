import { NextRequest, NextResponse } from "next/server";

import { getCatalog } from "@/lib/db";
import { ProductSort, RatingRange } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const shopId = searchParams.get("shopId");
  const categories = searchParams.get("categories");
  const sort = (searchParams.get("sort") ?? "default") as ProductSort;
  const ratingRange = (searchParams.get("ratingRange") ?? "all") as RatingRange;
  const page = Number(searchParams.get("page") ?? "1");

  const data = await getCatalog({
    shopId: shopId ? Number(shopId) : null,
    categoryIds: categories
      ? categories
          .split(",")
          .map((entry) => Number(entry))
          .filter(Boolean)
      : [],
    sort,
    ratingRange,
    page,
  });

  return NextResponse.json(data);
}
