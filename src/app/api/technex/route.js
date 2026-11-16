import { NextResponse } from "next/server";
import { getTechnexRegistrations, createTechnexRegistration, checkTechnexDuplicate } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const membershipType = searchParams.get("membershipType");
    const domain = searchParams.get("domain");

    const registrations = await getTechnexRegistrations({ search, status, membershipType, domain });
    return NextResponse.json({ success: true, count: registrations.length, data: registrations });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch TECHNEX registrations" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      membershipType,
      teamName,
      projectTitle,
      domain,
      abstractSummary,
      githubOrDriveUrl,
      leaderName,
      leaderEmail,
      leaderPhone,
      leaderCollege,
      leaderPrn,
      teamMembers,
    } = body;

    // 0. Membership Tier & Server-Side Fee Verification (Security Enforcement)
    const VALID_MEMBERSHIP_TIERS = {
      "S4DS Member": 49,
      "Non-S4DS Member": 99,
    };

    if (!membershipType || !VALID_MEMBERSHIP_TIERS.hasOwnProperty(membershipType)) {
      return NextResponse.json(
        { error: "Invalid membership category. Please select either 'S4DS Member' or 'Non-S4DS Member'." },
        { status: 400 }
      );
    }

    // Never trust client-side fee. Enforce verified server-calculated fee.
    const verifiedRegistrationFee = VALID_MEMBERSHIP_TIERS[membershipType];

    // Form validations
    if (!teamName || teamName.trim().length < 2) {
      return NextResponse.json({ error: "Team Name must be at least 2 characters long." }, { status: 400 });
    }
    if (!projectTitle || projectTitle.trim().length < 3) {
      return NextResponse.json({ error: "Project Title must be at least 3 characters long." }, { status: 400 });
    }
    if (!domain || domain.trim() === "") {
      return NextResponse.json({ error: "Project Domain category must be selected." }, { status: 400 });
    }
    if (!leaderName || leaderName.trim().length < 2) {
      return NextResponse.json({ error: "Team Leader Name is required." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!leaderEmail || !emailRegex.test(leaderEmail.trim())) {
      return NextResponse.json({ error: "Valid Team Leader email address is required." }, { status: 400 });
    }
    const phoneClean = (leaderPhone || "").replace(/\D/g, "");
    if (!leaderPhone || phoneClean.length < 10) {
      return NextResponse.json({ error: "Valid 10-digit Leader phone number is required." }, { status: 400 });
    }
    if (!leaderCollege || leaderCollege.trim().length < 2) {
      return NextResponse.json({ error: "College / University Name is required." }, { status: 400 });
    }
    if (!leaderPrn || leaderPrn.trim().length < 3) {
      return NextResponse.json({ error: "Leader PRN / Roll Number is required." }, { status: 400 });
    }

    // Duplicate prevention check
    const dupCheck = await checkTechnexDuplicate({ teamName, leaderEmail, leaderPrn });
    if (dupCheck.isDuplicate) {
      return NextResponse.json({ error: dupCheck.message, field: dupCheck.field }, { status: 409 });
    }

    // Create registration with verified server-side fee (no payment proof required)
    const newReg = await createTechnexRegistration({
      membershipType,
      registrationFee: verifiedRegistrationFee,
      teamName: teamName.trim(),
      projectTitle: projectTitle.trim(),
      domain: domain.trim(),
      abstractSummary: (abstractSummary || "").trim(),
      githubOrDriveUrl: (githubOrDriveUrl || "").trim(),
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.trim(),
      leaderPhone: phoneClean,
      leaderCollege: leaderCollege.trim(),
      leaderPrn: leaderPrn.trim(),
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration for TECHNEX 2K26 submitted successfully!",
        registrationCode: newReg.registrationCode,
        data: newReg,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/technex error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process TECHNEX registration." },
      { status: 500 }
    );
  }
}
