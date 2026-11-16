import { NextResponse } from "next/server";
import { getMediaItems, createMediaItem } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";
import { getSignedUrl } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const activeOnly = searchParams.get("activeOnly") === "true";

    const items = await getMediaItems({ category, search, activeOnly });

    // Refresh signed URLs for private items if requested
    const refreshed = await Promise.all(
      items.map(async (item) => {
        if (item.isPrivate && item.storagePath) {
          try {
            const freshSignedUrl = await getSignedUrl(item.storagePath, 3600);
            return { ...item, fileUrl: freshSignedUrl };
          } catch (e) {
            return item;
          }
        }
        return item;
      })
    );

    return NextResponse.json({
      success: true,
      data: refreshed,
      count: refreshed.length,
    });
  } catch (err) {
    console.error("GET /api/media error:", err);
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = validateAdminRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.storagePath || !body.fileUrl) {
      return NextResponse.json(
        { error: "storagePath and fileUrl are required" },
        { status: 400 }
      );
    }

    const newItem = await createMediaItem(body);
    return NextResponse.json(
      { success: true, message: "Media registered in RushDB", data: newItem },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/media error:", err);
    return NextResponse.json({ error: "Failed to create media record" }, { status: 500 });
  }
}
