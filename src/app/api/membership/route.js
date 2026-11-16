import { NextResponse } from "next/server";
import { getMemberships, createMembership, checkMembershipDuplicate } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const memberships = await getMemberships({ search, status });
    return NextResponse.json({ success: true, count: memberships.length, data: memberships });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch memberships" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, prn, department, academicYear, phone, transactionId, paymentProofUrl, membershipPlan } = body;

    // Strict validation
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Full name must be at least 2 characters long." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (!prn || prn.trim().length < 4) {
      return NextResponse.json({ error: "Valid PRN / Roll Number is required." }, { status: 400 });
    }
    if (!department || department.trim() === "") {
      return NextResponse.json({ error: "Academic department is required." }, { status: 400 });
    }
    if (!academicYear || academicYear.trim() === "") {
      return NextResponse.json({ error: "Academic year is required." }, { status: 400 });
    }
    const phoneClean = (phone || "").replace(/\D/g, "");
    if (!phone || phoneClean.length < 10) {
      return NextResponse.json({ error: "A valid 10-digit phone number is required." }, { status: 400 });
    }
    if (!transactionId || transactionId.trim().length < 4) {
      return NextResponse.json({ error: "Payment Transaction ID / UTR number is required." }, { status: 400 });
    }

    // Check duplicates before creating
    const dupCheck = await checkMembershipDuplicate({ email, prn, transactionId });
    if (dupCheck.isDuplicate) {
      return NextResponse.json({ error: dupCheck.message, field: dupCheck.field }, { status: 409 });
    }

    const newMembership = await createMembership({
      fullName: fullName.trim(),
      email: email.trim(),
      prn: prn.trim(),
      department: department.trim(),
      academicYear: academicYear.trim(),
      phone: phoneClean,
      membershipPlan: membershipPlan || "Annual (₹300)",
      transactionId: transactionId.trim(),
      paymentProofUrl: paymentProofUrl || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Membership application submitted successfully! Your application is under verification.",
        data: newMembership,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/membership error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process membership application." },
      { status: 500 }
    );
  }
}
