import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(
      {
        success: true,
        data: settings,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json(
      { error: "Failed to fetch website settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updated = await updateSettings(body);

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("PATCH /api/settings error:", err);
    return NextResponse.json(
      { error: "Failed to update website settings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return PATCH(request);
}
