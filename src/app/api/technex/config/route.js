import { NextResponse } from "next/server";
import { getTechnexConfig, updateTechnexConfig } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Public endpoint to fetch dynamic TECHNEX 2K26 configuration from RushDB.
 */
export async function GET() {
  try {
    const config = await getTechnexConfig();
    return NextResponse.json(
      {
        success: true,
        data: config,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/technex/config error:", err);
    return NextResponse.json(
      { error: "Failed to fetch TECHNEX configuration" },
      { status: 500 }
    );
  }
}

/**
 * Admin endpoint to update TECHNEX 2K26 configuration in RushDB.
 */
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
    const updated = await updateTechnexConfig(body);

    return NextResponse.json({
      success: true,
      message: "TECHNEX configuration updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("PATCH /api/technex/config error:", err);
    return NextResponse.json(
      { error: "Failed to update TECHNEX configuration" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return PATCH(request);
}
