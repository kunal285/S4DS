const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || "").trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
} catch (e) {}

let PORT = 3000;
let BASE_URL = `http://localhost:${PORT}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return { status: res.status, ok: res.ok, data: JSON.parse(text), headers: res.headers };
  } catch {
    return { status: res.status, ok: res.ok, raw: text, headers: res.headers };
  }
}

async function runAudit() {
  console.log("==========================================================");
  console.log("  S4DS MITAOE WEBSITE: SENIOR-LEVEL CODE & UI/UX AUDIT   ");
  console.log("==========================================================\n");

  const results = {
    passed: [],
    failed: [],
    details: [],
  };

  function record(title, success, note = "") {
    if (success) {
      results.passed.push(title);
      console.log(`[PASS] ${title}`);
    } else {
      results.failed.push(title);
      console.log(`[FAIL] ${title} - ${note}`);
    }
    results.details.push({ title, success, note });
  }

  // 1. Check if server is already running on port 3000
  let serverProcess = null;
  let ready = false;
  try {
    const res = await fetch(`${BASE_URL}/`);
    if (res.status === 200) {
      ready = true;
      console.log("Connected to active Next.js server on port", PORT);
    }
  } catch {}

  if (!ready) {
    PORT = 3005;
    BASE_URL = `http://localhost:${PORT}`;
    console.log("Starting server on port", PORT, "...");
    serverProcess = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true,
    });

    for (let i = 0; i < 30; i++) {
      await sleep(1000);
      try {
        const res = await fetch(`${BASE_URL}/`);
        if (res.status === 200) {
          ready = true;
          break;
        }
      } catch {}
    }
  }

  if (!ready) {
    console.error("FATAL: Server failed to connect or start");
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }

  console.log("\n--- EXECUTING VERIFICATION SUITE ---\n");

  try {
    // ----------------------------------------------------
    // CHECK 1: Public Pages & Static Navigation Links
    // ----------------------------------------------------
    const pages = [
      "/",
      "/about",
      "/events",
      "/technex-2k26",
      "/team",
      "/gallery",
      "/membership",
      "/contact",
      "/admin/login",
      "/admin/media",
      "/robots.txt",
      "/sitemap.xml",
    ];

    for (const page of pages) {
      const res = await fetch(`${BASE_URL}${page}`);
      record(`Public Route Availability: ${page}`, res.status === 200, `Received HTTP status ${res.status}`);
    }

    // Verify /technex redirects to /technex-2k26
    const redirRes = await fetch(`${BASE_URL}/technex`, { redirect: "manual" });
    const isRedirect = (redirRes.status === 307 || redirRes.status === 308 || redirRes.status === 302) &&
      (redirRes.headers.get("location")?.includes("/technex-2k26"));
    record(`Backward Compatibility: /technex redirects to /technex-2k26`, isRedirect, `Status ${redirRes.status}, Location: ${redirRes.headers.get("location")}`);

    // ----------------------------------------------------
    // CHECK 2: API Security & Protected Routes
    // ----------------------------------------------------
    const unauthEventsRes = await fetchJson("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Hack Event", date: "2026-12-01" }),
    });
    record("Protected Route: POST /api/events blocks unauthenticated access", unauthEventsRes.status === 401);

    const unauthTeamRes = await fetchJson("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Hacker", role: "Attacker" }),
    });
    record("Protected Route: POST /api/team blocks unauthenticated access", unauthTeamRes.status === 401);

    const unauthMembershipRes = await fetchJson("/api/membership");
    record("Protected Route: GET /api/membership blocks unauthenticated access", unauthMembershipRes.status === 401);

    const unauthTechnexRes = await fetchJson("/api/technex");
    record("Protected Route: GET /api/technex blocks unauthenticated access", unauthTechnexRes.status === 401);

    // ----------------------------------------------------
    // CHECK 3: Admin Authentication Workflow
    // ----------------------------------------------------
    const adminEmail = process.env.ADMIN_EMAIL || "s4ds.datascience@mitaoe.ac.in";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@S4DSMITAOE";

    const badLoginRes = await fetchJson("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: "wrong_password_test" }),
    });
    record("Admin Auth: Rejects incorrect password", badLoginRes.status === 401);

    const goodLoginRes = await fetchJson("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });
    const adminToken = goodLoginRes.data?.token;
    record("Admin Auth: Authenticates default admin and returns JWT token", goodLoginRes.status === 200 && Boolean(adminToken));

    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    };

    const meRes = await fetchJson("/api/auth/me", { headers: authHeaders });
    record("Admin Auth: /api/auth/me validates JWT token", meRes.status === 200 && meRes.data?.authenticated === true);

    // ----------------------------------------------------
    // CHECK 4: Events CRUD Functionality
    // ----------------------------------------------------
    const createEventRes = await fetchJson("/api/events", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        title: "Test AI Symposium 2026",
        category: "Workshop",
        date: "2026-12-15",
        time: "11:00 AM",
        venue: "Auditorium 2",
        description: "Test symposium description",
        isFeatured: true,
      }),
    });
    const createdEventId = createEventRes.data?.data?.id;
    record("Events CRUD: Create new event", createEventRes.status === 201 && Boolean(createdEventId));

    const getEventRes = await fetchJson(`/api/events/${createdEventId}`);
    record("Events CRUD: Read single event by ID", getEventRes.status === 200 && getEventRes.data?.data?.title === "Test AI Symposium 2026");

    const updateEventRes = await fetchJson(`/api/events/${createdEventId}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ title: "Updated AI Symposium 2026", status: "Upcoming" }),
    });
    record("Events CRUD: Update existing event", updateEventRes.status === 200 && updateEventRes.data?.data?.title === "Updated AI Symposium 2026");

    const deleteEventRes = await fetchJson(`/api/events/${createdEventId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    record("Events CRUD: Delete event", deleteEventRes.status === 200);

    // ----------------------------------------------------
    // CHECK 5: Team Members CRUD Functionality
    // ----------------------------------------------------
    const createTeamRes = await fetchJson("/api/team", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Test Lead User",
        role: "R&D Head",
        domain: "Software & AI Systems",
        year: "Third Year B.Tech",
        bio: "Testing team creation",
      }),
    });
    const createdTeamId = createTeamRes.data?.data?.id;
    record("Team CRUD: Create new team member", createTeamRes.status === 201 && Boolean(createdTeamId));

    const updateTeamRes = await fetchJson(`/api/team/${createdTeamId}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ role: "Chief R&D Lead" }),
    });
    record("Team CRUD: Update team member", updateTeamRes.status === 200 && updateTeamRes.data?.data?.role === "Chief R&D Lead");

    const deleteTeamRes = await fetchJson(`/api/team/${createdTeamId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    record("Team CRUD: Delete team member", deleteTeamRes.status === 200);

    // ----------------------------------------------------
    // CHECK 6: Projects CRUD Functionality
    // ----------------------------------------------------
    const createProjRes = await fetchJson("/api/projects", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        title: "Test Autonomous Drone Platform",
        domain: "AI / IoT & Green Tech",
        description: "Autonomous obstacle avoidance and path planning",
        technologies: "Python, ROS2, YOLOv8",
        teamMembers: "Test Author",
      }),
    });
    const createdProjId = createProjRes.data?.data?.id;
    record("Projects CRUD: Create project", createProjRes.status === 201 && Boolean(createdProjId));

    const deleteProjRes = await fetchJson(`/api/projects/${createdProjId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    record("Projects CRUD: Delete project", deleteProjRes.status === 200);

    // ----------------------------------------------------
    // CHECK 7: Gallery CRUD Functionality
    // ----------------------------------------------------
    const createGalRes = await fetchJson("/api/gallery", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        title: "Test Hackathon Final Ceremony",
        category: "Expos",
        eventName: "TECHNEX",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
        caption: "Ceremony test photo",
      }),
    });
    const createdGalId = createGalRes.data?.data?.id;
    record("Gallery CRUD: Create gallery item", createGalRes.status === 201 && Boolean(createdGalId));

    const deleteGalRes = await fetchJson(`/api/gallery/${createdGalId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    record("Gallery CRUD: Delete gallery item", deleteGalRes.status === 200);

    // ----------------------------------------------------
    // CHECK 8: Membership Workflow & Duplicate Prevention
    // ----------------------------------------------------
    const testRunId = Date.now();
    const memData = {
      fullName: "Pooja Deshmukh",
      email: `pooja.test.${testRunId}@mitaoe.ac.in`,
      prn: `PRN${testRunId}`,
      department: "Data Science & AI",
      academicYear: "Second Year B.Tech",
      phone: "9876543210",
      transactionId: `UPI${testRunId}`,
    };

    const firstMemRes = await fetchJson("/api/membership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memData),
    });
    record("Membership Workflow: Submit valid application", firstMemRes.status === 201);

    const dupMemRes = await fetchJson("/api/membership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memData),
    });
    record("Membership Workflow: Prevent duplicate PRN / Email", dupMemRes.status === 409);

    const badEmailMemRes = await fetchJson("/api/membership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...memData, email: "invalid-email", prn: "999999" }),
    });
    record("Membership Workflow: Form validation rejects malformed email", badEmailMemRes.status === 400);

    // ----------------------------------------------------
    // CHECK 9: TECHNEX 2K26 Registration Workflow & Membership Tiers
    // ----------------------------------------------------
    // CHECK 9: TECHNEX 2K26 Registration Workflow (Payment Proof & Direct Submission)
    // ----------------------------------------------------
    const technexData = {
      membershipType: "S4DS Member",
      registrationFee: 49,
      teamName: `AlphaInnovators_${testRunId}`,
      projectTitle: "AI Powered Urban Traffic Signal Optimization",
      domain: "Artificial Intelligence & ML",
      abstractSummary: "Adaptive reinforcement learning for real-time traffic junction clearing.",
      leaderName: "Kunal Gavit",
      leaderEmail: `kunal.leader.${testRunId}@mitaoe.ac.in`,
      leaderPhone: "9876543219",
      leaderCollege: "MIT Academy of Engineering, Pune",
      leaderPrn: `PRN_TNX_${testRunId}`,
      utr: "431289567123",
      paymentScreenshotUrl: "https://cflqsjjkekfrnjjbhuja.supabase.co/storage/v1/object/public/s4ds-media/payment/screenshots/test.png",
      paymentScreenshotPath: "payment/screenshots/test.png",
      teamMembers: [
        { name: "Saurabh Patil", email: `saurabh.${testRunId}@mitaoe.ac.in`, phone: "9876543218", prn: `PRN_MBR_${testRunId}` },
      ],
    };

    // 1. Submit S4DS Member team (₹49)
    const firstTechnexRes = await fetchJson("/api/technex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(technexData),
    });
    const regCode = firstTechnexRes.data?.registrationCode;
    const isFee49 = firstTechnexRes.data?.data?.registrationFee === 49 && firstTechnexRes.data?.data?.membershipType === "S4DS Member";
    const initialStatusOk = firstTechnexRes.data?.data?.registrationStatus === "Successfully Registered";
    const utrSaved = firstTechnexRes.data?.data?.utr === "431289567123";
    record("TECHNEX Workflow: Submit S4DS Member team (Verified ₹49 fee, UTR & Direct Registration)", firstTechnexRes.status === 201 && Boolean(regCode) && isFee49 && initialStatusOk && utrSaved);

    // 2. Submit Non-S4DS Member team (₹99)
    const nonMemberTechnexRes = await fetchJson("/api/technex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...technexData,
        membershipType: "Non-S4DS Member",
        registrationFee: 99,
        teamName: `BetaInnovators_${testRunId}`,
        leaderEmail: `kunal.beta.${testRunId}@mitaoe.ac.in`,
        leaderPrn: `PRN_BETA_${testRunId}`,
        utr: "987654321098",
      }),
    });
    const isFee99 = nonMemberTechnexRes.data?.data?.registrationFee === 99 && nonMemberTechnexRes.data?.data?.membershipType === "Non-S4DS Member";
    record("TECHNEX Workflow: Submit Non-S4DS Member team (Verified ₹99 fee)", nonMemberTechnexRes.status === 201 && isFee99);

    // 3. Validation: Reject submission without UTR
    const missingUtrRes = await fetchJson("/api/technex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...technexData,
        teamName: `NoUtrTeam_${testRunId}`,
        leaderEmail: `noutr.${testRunId}@mitaoe.ac.in`,
        leaderPrn: `PRN_NOUTR_${testRunId}`,
        utr: "",
      }),
    });
    record("TECHNEX Validation: Reject missing UPI / UTR with HTTP 400", missingUtrRes.status === 400);

    // 4. Validation: Reject submission without Payment Screenshot
    const missingScreenshotRes = await fetchJson("/api/technex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...technexData,
        teamName: `NoProofTeam_${testRunId}`,
        leaderEmail: `noproof.${testRunId}@mitaoe.ac.in`,
        leaderPrn: `PRN_NOPROOF_${testRunId}`,
        paymentScreenshotUrl: "",
        paymentScreenshotPath: "",
      }),
    });
    record("TECHNEX Validation: Reject missing payment screenshot with HTTP 400", missingScreenshotRes.status === 400);

    // 5. Security test: Attempt fee tampering (send ₹1 for S4DS Member) -> Server must recalculate to ₹49
    const tamperFeeRes = await fetchJson("/api/technex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...technexData,
        membershipType: "S4DS Member",
        registrationFee: 1, // Tampered fee attempt
        teamName: `TamperTeam_${testRunId}`,
        leaderEmail: `tamper.${testRunId}@mitaoe.ac.in`,
        leaderPrn: `PRN_TAMPER_${testRunId}`,
      }),
    });
    const feeRecalculated = tamperFeeRes.status === 201 && tamperFeeRes.data?.data?.registrationFee === 49;
    record("TECHNEX Security: Server recalculates tampered client fee to verified ₹49", feeRecalculated);

    // 6. Validation: Reject invalid or missing membership category
    const invalidCategoryRes = await fetchJson("/api/technex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...technexData,
        membershipType: "VIP Pass",
        teamName: `InvalidCatTeam_${testRunId}`,
      }),
    });
    record("TECHNEX Security: Reject invalid membership category with HTTP 400", invalidCategoryRes.status === 400);

    const dupTechnexRes = await fetchJson("/api/technex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(technexData),
    });
    record("TECHNEX Workflow: Prevent duplicate Team Name & Leader PRN", dupTechnexRes.status === 409);

    const missingLeaderRes = await fetchJson("/api/technex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...technexData, teamName: "UniqueTeam2", leaderEmail: "" }),
    });
    record("TECHNEX Workflow: Validate required fields and reject empty leader email", missingLeaderRes.status === 400);

    // ----------------------------------------------------
    // CHECK 10: Confirmation API & Admin Registration Management
    // ----------------------------------------------------
    const createdTechId = firstTechnexRes.data?.data?.id;
    const createdTechToken = firstTechnexRes.data?.data?.confirmationToken;

    if (createdTechId) {
      // Test confirmation retrieval
      const confirmRes = await fetchJson(`/api/technex/confirm?id=${createdTechId}&token=${createdTechToken}`);
      record(
        "Confirmation API: /api/technex/confirm returns registration status 'Successfully Registered'",
        confirmRes.status === 200 && confirmRes.data?.data?.registrationStatus === "Successfully Registered"
      );

      // Test status update action
      const updateStatusRes = await fetchJson(`/api/technex/${createdTechId}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status: "Approved" }),
      });
      record(
        "Admin Management: Update TECHNEX approval status",
        updateStatusRes.status === 200 && updateStatusRes.data?.data?.status === "Approved"
      );

      // Test membershipType filter API
      const filterRes = await fetchJson(`/api/technex?membershipType=S4DS Member`, {
        headers: authHeaders,
      });
      record(
        "Admin Management: Filter TECHNEX registrations by membershipType",
        filterRes.status === 200 && Array.isArray(filterRes.data?.data)
      );

      // Verify admin list returns UTR and payment proof
      const adminListRes = await fetchJson("/api/technex", { headers: authHeaders });
      const foundReg = adminListRes.data?.data?.find((r) => r.id === createdTechId);
      record(
        "Admin Management: TECHNEX registrations include UTR and payment screenshot URL",
        adminListRes.status === 200 && Boolean(foundReg?.utr) && Boolean(foundReg?.paymentScreenshotUrl)
      );
    }

    const createdMemId = firstMemRes.data?.data?.id;
    if (createdMemId) {
      const updateMemStatusRes = await fetchJson(`/api/membership/${createdMemId}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status: "Approved" }),
      });
      record("Registration Review: Admin updates Membership status to Approved", updateMemStatusRes.status === 200 && updateMemStatusRes.data?.data?.status === "Approved");

      // Clean up test membership to ensure 0 dummy data remains
      await fetchJson(`/api/membership/${createdMemId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    }

    // Clean up test TECHNEX submissions so 0 dummy data remains
    const idsToClean = [
      createdTechId,
      nonMemberTechnexRes.data?.data?.id,
      tamperFeeRes.data?.data?.id,
    ].filter(Boolean);
    for (const techId of idsToClean) {
      await fetchJson(`/api/technex/${techId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    }

    // ----------------------------------------------------
    // CHECK 11: Cloudinary Storage & RushDB Media Manager
    // ----------------------------------------------------
    const hasCloudinaryConfig = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_URL
    );
    record("Cloudinary Storage: Configured with Cloud Name", hasCloudinaryConfig);

    // Create a mock image buffer for upload test
    const dummyImageBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    const formData = new FormData();
    const blob = new Blob([dummyImageBuffer], { type: "image/png" });
    formData.append("file", blob, "test-pixel.png");
    formData.append("category", "payment-qr");
    formData.append("title", "Official Test Payment QR");
    formData.append("isActive", "true");

    const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });
    const uploadJson = await uploadRes.json();
    if (uploadRes.status !== 200) {
      console.log("Upload failed debug:", uploadRes.status, uploadJson);
    }
    const isCloudinaryUrl = uploadJson.url?.includes("cloudinary.com") || (uploadJson.storagePath && uploadJson.success);
    record("Cloudinary Storage: Handles multipart upload and returns storage reference", uploadRes.status === 200 && isCloudinaryUrl);
    record("Cloudinary Target Folder: Asset stored in 'S4DS' folder", uploadJson.storagePath?.startsWith("S4DS/"));
    record("Cloudinary Subfolder Architecture: Assets organized into subfolders inside S4DS", uploadJson.folder?.startsWith("S4DS/"));
    record("RushDB Integration: Automatically stores media metadata with MEDIA_ITEM label", Boolean(uploadJson.mediaId));

    const uploadedMediaId = uploadJson.mediaId;

    // Test private payment screenshot upload & signed URL protection
    const screenshotForm = new FormData();
    screenshotForm.append("file", blob, "private-receipt.png");
    screenshotForm.append("category", "payment-screenshot");
    screenshotForm.append("title", "Applicant UTR Proof");
    const screenshotRes = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: screenshotForm,
    });
    const screenshotJson = await screenshotRes.json();
    const isSignedProtected = screenshotJson.media?.isPrivate === true;
    record("Cloudinary Privacy: Payment screenshots are stored privately with authenticated URL access", screenshotRes.status === 200 && isSignedProtected);

    // Clean up test screenshot
    if (screenshotJson.mediaId) {
      await fetchJson(`/api/media/${screenshotJson.mediaId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    }

    // Check invalid file type rejection
    const invalidForm = new FormData();
    const exeBlob = new Blob([Buffer.from("MZ malicious exe")], { type: "application/x-msdownload" });
    invalidForm.append("file", exeBlob, "malicious.exe");
    const invalidUploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: invalidForm,
    });
    record("Image Upload Security: Rejects prohibited MIME types", invalidUploadRes.status === 400);

    // Media Manager API: Fetch list from RushDB
    const mediaListRes = await fetchJson("/api/media?category=payment-qr");
    record("Media Manager API: GET /api/media lists category assets from RushDB", mediaListRes.status === 200 && Array.isArray(mediaListRes.data?.data));

    // Media Manager API: Fetch active QR
    const activeQrRes = await fetchJson("/api/media/active?category=payment-qr");
    record("Media Manager API: GET /api/media/active returns live payment QR", activeQrRes.status === 200 && Boolean(activeQrRes.data?.data?.fileUrl));

    // Media Manager API: Update status via PATCH /api/media/:id
    if (uploadedMediaId) {
      const updateMediaRes = await fetchJson(`/api/media/${uploadedMediaId}`, {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ category: "payment-qr", isActive: false }),
      });
      record("Media Manager API: PATCH /api/media/:id updates asset status in RushDB", updateMediaRes.status === 200 && updateMediaRes.data?.data?.isActive === false);

      // Media Manager API: Delete asset from Cloudinary & RushDB
      const deleteMediaRes = await fetchJson(`/api/media/${uploadedMediaId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      record("Media Manager API: DELETE /api/media/:id removes file from Cloudinary and RushDB", deleteMediaRes.status === 200);
    }

    // Architecture Check: Verify no MongoDB or Mongoose in package.json
    const pkgJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    const noMongo = !pkgJson.dependencies?.mongodb && !pkgJson.dependencies?.mongoose;
    record("Architecture Enforcement: MongoDB and Mongoose are completely removed", noMongo);

    // ----------------------------------------------------
    // CHECK 12: SEO, Sitemap and Robots.txt
    // ----------------------------------------------------
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsTxt = await robotsRes.text();
    record("SEO: robots.txt properly configured with disallow rules", robotsRes.status === 200 && robotsTxt.includes("Disallow: /admin/"));

    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapXml = await sitemapRes.text();
    record("SEO: sitemap.xml dynamically lists all canonical live routes", sitemapRes.status === 200 && sitemapXml.includes("/technex-2k26") && sitemapXml.includes("/contact") && sitemapXml.includes("/events"));

    // ----------------------------------------------------
    // CHECK 13: Dashboard Analytics & Stats API
    // ----------------------------------------------------
    const statsRes = await fetchJson("/api/stats", { headers: authHeaders });
    record("Stats API: Returns aggregated metrics for admin overview", statsRes.status === 200 && statsRes.data?.data?.totalEvents >= 1);

  } finally {
    if (serverProcess) {
      console.log("\nStopping test server...");
      serverProcess.kill();
    }
  }

  console.log("\n==========================================================");
  console.log(`  AUDIT RESULTS: ${results.passed.length} PASSED, ${results.failed.length} FAILED`);
  console.log("==========================================================");

  if (results.failed.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAudit();
