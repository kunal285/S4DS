import { NextResponse } from "next/server";
import { getGallery, createGalleryItem } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const items = await getGallery({ category, search });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ error: "Title and Image URL are required" }, { status: 400 });
    }

    const item = await createGalleryItem(body);
    return NextResponse.json({ success: true, message: "Gallery item added", data: item }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}
