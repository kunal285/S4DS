import { NextResponse } from "next/server";
import { getActivePaymentQr, getMediaItems } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "payment-qr";

    if (category === "payment-qr") {
      const activeQr = await getActivePaymentQr();
      return NextResponse.json({
        success: true,
        data: activeQr,
      });
    }

    const activeList = await getMediaItems({ category, activeOnly: true });
    return NextResponse.json({
      success: true,
      data: activeList[0] || null,
    });
  } catch (err) {
    console.error("GET /api/media/active error:", err);
    return NextResponse.json({ error: "Failed to retrieve active media" }, { status: 500 });
  }
}
