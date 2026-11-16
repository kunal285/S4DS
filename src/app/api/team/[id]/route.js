import { NextResponse } from "next/server";
import { getTeamMemberById, updateTeamMember, deleteTeamMember } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const member = await getTeamMemberById(id);
    if (!member) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: member });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 });
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
    const updated = await updateTeamMember(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Team member updated", data: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteTeamMember(id);
    if (!deleted) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Team member removed successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
