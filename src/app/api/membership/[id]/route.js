import { NextResponse } from "next/server";
import { updateMembershipStatus, deleteMembership } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteMembership(id);
    return NextResponse.json({ success: true, message: "Membership deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete membership" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await updateMembershipStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Membership record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Membership status updated to ${status}`, data: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update membership status" }, { status: 500 });
  }
}
