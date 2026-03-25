import { NextRequest, NextResponse } from "next/server";

import { createOrder } from "@/lib/db";
import { checkoutSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation failed." },
        { status: 400 },
      );
    }

    const result = await createOrder(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Order could not be created.",
      },
      { status: 500 },
    );
  }
}
