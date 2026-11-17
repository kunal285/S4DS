import { NextResponse } from "next/server";
import { getMediaItemById, updateMediaItem, deleteMediaItem } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";
import { deleteFromCloudinary, getSignedUrl } from "@/lib/cloudinary";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const item = await getMediaItemById(id);
    if (!item) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    if (item.isPrivate && item.storagePath) {
      try {
        const signedUrl = await getSignedUrl(item.storagePath, 3600);
        return NextResponse.json({ success: true, data: { ...item, fileUrl: signedUrl } });
      } catch (e) {
        // Fall back to stored url
      }
    }

    return NextResponse.json({ success: true, data: item });
  } catch (err) {
    console.error("GET /api/media/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch media item" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = validateAdminRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await getMediaItemById(id);
    if (!existing) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    const updated = await updateMediaItem(id, body);
    return NextResponse.json({
      success: true,
      message: "Media item updated in RushDB successfully",
      data: updated,
    });
  } catch (err) {
    console.error("PATCH /api/media/[id] error:", err);
    return NextResponse.json({ error: "Failed to update media item" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = validateAdminRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await getMediaItemById(id);
    if (!existing) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    // 1. Delete from Cloudinary
    if (existing.storagePath) {
      try {
        await deleteFromCloudinary(existing.storagePath);
      } catch (storageErr) {
        console.warn("Notice deleting from Cloudinary:", storageErr.message);
      }
    }

    // 2. Delete metadata from RushDB
    await deleteMediaItem(id);

    return NextResponse.json({
      success: true,
      message: "Media deleted from Cloudinary and RushDB successfully",
    });
  } catch (err) {
    console.error("DELETE /api/media/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
