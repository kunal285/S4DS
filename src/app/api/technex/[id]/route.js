import { NextResponse } from "next/server";
import { updateTechnexStatus, deleteTechnexRegistration } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteTechnexRegistration(id);
    return NextResponse.json({ success: true, message: "Registration deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete TECHNEX registration" }, { status: 500 });
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
    const { status, paymentStatus } = body;

    const validStatuses = ["Pending", "Approved", "Shortlisted", "Finalist", "Rejected"];
    const validPaymentStatuses = ["Pending Verification", "Verified", "Rejected"];

    const updates = {};
    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      updates.status = status;
    }

    if (paymentStatus !== undefined) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json({ error: "Invalid paymentStatus value" }, { status: 400 });
      }
      updates.paymentStatus = paymentStatus;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid status or paymentStatus fields provided" }, { status: 400 });
    }

    const updated = await updateTechnexStatus(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Registration record not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Registration status updated successfully`,
      data: updated,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update TECHNEX registration status" }, { status: 500 });
  }
}
