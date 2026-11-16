import { NextResponse } from "next/server";
import { getTeam, createTeamMember } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const search = searchParams.get("search");

    const team = await getTeam({ domain, search });
    return NextResponse.json({ success: true, count: team.length, data: team });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    const member = await createTeamMember(body);
    return NextResponse.json({ success: true, message: "Team member added", data: member }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}
