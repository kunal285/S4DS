import { NextResponse } from "next/server";
import { getTechnexRegistrations, createTechnexRegistration, checkTechnexDuplicate } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";
import { uploadToSupabase, getSignedUrl } from "@/lib/supabase";

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

    // Refresh signed URLs for private payment screenshots so administrators can view them securely
    const refreshed = await Promise.all(
      registrations.map(async (reg) => {
        if (reg.paymentScreenshotPath) {
          try {
            const freshSignedUrl = await getSignedUrl(reg.paymentScreenshotPath, 3600);
            return { ...reg, paymentScreenshotUrl: freshSignedUrl };
          } catch {
            return reg;
          }
        }
        return reg;
      })
    );

    return NextResponse.json({ success: true, count: refreshed.length, data: refreshed });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch TECHNEX registrations" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data = {};
    let screenshotFile = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      screenshotFile = formData.get("screenshot") || formData.get("paymentScreenshot") || formData.get("file");

      let parsedMembers = [];
      const rawMembers = formData.get("teamMembers");
      if (rawMembers) {
        try {
          parsedMembers = typeof rawMembers === "string" ? JSON.parse(rawMembers) : rawMembers;
        } catch {
          parsedMembers = [];
        }
      }

      data = {
        membershipType: formData.get("membershipType"),
        teamName: formData.get("teamName"),
        projectTitle: formData.get("projectTitle"),
        domain: formData.get("domain"),
        abstractSummary: formData.get("abstractSummary"),
        githubOrDriveUrl: formData.get("githubOrDriveUrl"),
        leaderName: formData.get("leaderName"),
        leaderEmail: formData.get("leaderEmail"),
        leaderPhone: formData.get("leaderPhone"),
        leaderCollege: formData.get("leaderCollege"),
        leaderPrn: formData.get("leaderPrn"),
        teamMembers: parsedMembers,
        utr: formData.get("utr") || formData.get("upiTransactionId"),
        paymentScreenshotUrl: formData.get("paymentScreenshotUrl") || "",
        paymentScreenshotPath: formData.get("paymentScreenshotPath") || "",
      };
    } else {
      data = await request.json();
    }

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
      utr,
    } = data;

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

    // 1. UPI Transaction ID / UTR Validation
    const trimmedUtr = (utr || "").trim();
    if (!trimmedUtr || trimmedUtr.length < 4) {
      return NextResponse.json({ error: "Valid UPI Transaction ID / UTR is required." }, { status: 400 });
    }

    // 2. Payment Screenshot Validation & Supabase Storage Upload
    let paymentScreenshotUrl = data.paymentScreenshotUrl || "";
    let paymentScreenshotPath = data.paymentScreenshotPath || "";

    if (screenshotFile && typeof screenshotFile !== "string") {
      const allowedMimes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedMimes.includes(screenshotFile.type)) {
        return NextResponse.json(
          { error: "Payment screenshot must be a PNG, JPG, or JPEG image." },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await screenshotFile.arrayBuffer());
      const uploadResult = await uploadToSupabase({
        fileBuffer: buffer,
        fileName: screenshotFile.name || "payment-proof.png",
        mimeType: screenshotFile.type,
        category: "payment-screenshot",
        isPrivate: true,
      });
      paymentScreenshotUrl = uploadResult.fileUrl;
      paymentScreenshotPath = uploadResult.storagePath;
    }

    if (!paymentScreenshotUrl && !paymentScreenshotPath) {
      return NextResponse.json(
        { error: "Payment screenshot proof is required." },
        { status: 400 }
      );
    }

    // Duplicate prevention check
    const dupCheck = await checkTechnexDuplicate({ teamName, leaderEmail, leaderPrn });
    if (dupCheck.isDuplicate) {
      return NextResponse.json({ error: dupCheck.message, field: dupCheck.field }, { status: 409 });
    }

    // Create registration in RushDB with verified server-side fee and payment proof
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
      utr: trimmedUtr,
      paymentScreenshotUrl,
      paymentScreenshotPath,
      registrationStatus: "Successfully Registered",
      status: "Approved",
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
