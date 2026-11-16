import { NextResponse } from "next/server";
import { getGalleryById, updateGalleryItem, deleteGalleryItem } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const item = await getGalleryById(id);
    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch gallery item" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await updateGalleryItem(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Gallery item updated", data: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteGalleryItem(id);
    if (!deleted) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
