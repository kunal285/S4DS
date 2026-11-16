import { NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const events = await getEvents({ category, status, search });
    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (err) {
    console.error("GET /api/events error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.date) {
      return NextResponse.json({ error: "Event title and date are required" }, { status: 400 });
    }

    const event = await createEvent(body);
    return NextResponse.json({ success: true, message: "Event created successfully", data: event }, { status: 201 });
  } catch (err) {
    console.error("POST /api/events error:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
