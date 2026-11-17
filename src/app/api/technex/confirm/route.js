import { NextResponse } from "next/server";
import { getTechnexRegistrationById } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Registration ID is required." },
        { status: 400 }
      );
    }

    const reg = await getTechnexRegistrationById(id);
    if (!reg) {
      return NextResponse.json(
        { error: `Registration record not found for ID: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: reg,
      },
      {
        headers: {
          "Cache-Control": "no-store, private",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/technex/confirm error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve registration details." },
      { status: 500 }
    );
  }
}
