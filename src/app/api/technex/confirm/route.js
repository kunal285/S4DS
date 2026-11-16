import { NextResponse } from "next/server";
import { getTechnexRegistrationByConfirmation } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (!id) {
      return NextResponse.json(
        { error: "Registration ID is required." },
        { status: 400 }
      );
    }

    const reg = await getTechnexRegistrationByConfirmation(id, token);
    if (!reg) {
      return NextResponse.json(
        { error: "Registration not found or unauthorized confirmation access." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reg,
    });
  } catch (err) {
    console.error("GET /api/technex/confirm error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve confirmation details." },
      { status: 500 }
    );
  }
}
