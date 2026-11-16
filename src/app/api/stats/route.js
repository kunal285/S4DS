import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const admin = validateAdminRequest(request);
    const stats = await getDashboardStats();

    if (!admin) {
      // Return public overview stats
      return NextResponse.json({
        success: true,
        data: {
          totalEvents: stats.totalEvents,
          totalProjects: stats.totalProjects,
          totalTeamMembers: stats.totalTeamMembers,
          totalGalleryItems: stats.totalGalleryItems,
        },
      });
    }

    // Return full administrative metrics
    return NextResponse.json({ success: true, data: stats });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
