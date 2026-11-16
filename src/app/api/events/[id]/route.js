import { NextResponse } from "next/server";
import { getEventById, updateEvent, deleteEvent } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const event = await getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
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
    const updated = await updateEvent(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Event updated", data: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteEvent(id);
    if (!deleted) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
