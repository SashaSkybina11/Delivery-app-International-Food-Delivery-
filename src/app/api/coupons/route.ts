import { NextResponse } from "next/server";

import { getCoupons } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const coupons = await getCoupons();
  return NextResponse.json({ coupons });
}
