const fs = require("fs");
const path = require("path");

// Load .env
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  }
}

const { findRecords } = require("../src/lib/rushdb");

async function runEndToEndTest() {
  console.log("=================================================");
  console.log("   TECHNEX 2K26 REGISTRATION FLOW INTEGRATION TEST");
  console.log("=================================================");

  const timestamp = Date.now();
  const testTeamName = `Test Team Apex ${timestamp}`;
  const testLeaderEmail = `leader.${timestamp}@mitaoe.ac.in`;
  const testLeaderPrn = `PRN${timestamp}`;

  // 1. Create a dummy PNG in memory for the screenshot
  // 1x1 transparent PNG
  const dummyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const dummyBuffer = Buffer.from(dummyPngBase64, "base64");
  const blob = new Blob([dummyBuffer], { type: "image/png" });

  const formData = new FormData();
  formData.append("membershipType", "S4DS Member");
  formData.append("teamName", testTeamName);
  formData.append("projectTitle", "Decentralized AI Medical Imaging");
  formData.append("domain", "Artificial Intelligence & ML");
  formData.append("abstractSummary", "Integrating neural networks with distributed edge devices.");
  formData.append("githubOrDriveUrl", "https://github.com/s4ds/project-apex");
  formData.append("leaderName", "Aarav Sharma");
  formData.append("leaderEmail", testLeaderEmail);
  formData.append("leaderPhone", "9876543210");
  formData.append("leaderCollege", "MIT Academy of Engineering, Pune");
  formData.append("leaderPrn", testLeaderPrn);
  formData.append("teamMembers", JSON.stringify([
    { name: "Pooja Patel", email: "pooja@mitaoe.ac.in", phone: "9876543211", prn: "PRN_MEM_1" },
    { name: "Rohan Deshmukh", email: "rohan@mitaoe.ac.in", phone: "9876543212", prn: "PRN_MEM_2" }
  ]));
  formData.append("utr", "123456789012");
  formData.append("screenshot", blob, "payment-proof.png");

  console.log("\n[Step 1] Submitting registration to POST http://localhost:3000/api/technex...");
  const postRes = await fetch("http://localhost:3000/api/technex", {
    method: "POST",
    body: formData,
  });

  const postJson = await postRes.json();
  console.log("Response status:", postRes.status);
  console.log("Response payload:", {
    success: postJson.success,
    registrationId: postJson.registrationId,
    registrationCode: postJson.registrationCode,
    id: postJson.id,
    message: postJson.message,
  });

  if (!postRes.ok || !postJson.success) {
    throw new Error("Registration submission failed: " + JSON.stringify(postJson));
  }

  const returnedRegId = postJson.registrationId || postJson.registrationCode;
  if (!returnedRegId) {
    throw new Error("No registrationId or registrationCode returned in API response!");
  }
  console.log("✓ Registration ID successfully received:", returnedRegId);

  // 2. Fetch confirmation by ID via /api/technex/confirm?id=...
  console.log(`\n[Step 2] Testing GET /api/technex/confirm?id=${returnedRegId}...`);
  const confirmRes = await fetch(`http://localhost:3000/api/technex/confirm?id=${encodeURIComponent(returnedRegId)}`);
  const confirmJson = await confirmRes.json();
  console.log("Confirm API status:", confirmRes.status);
  console.log("Confirm data:", {
    id: confirmJson.data?.id,
    registrationCode: confirmJson.data?.registrationCode,
    teamName: confirmJson.data?.teamName,
    leaderName: confirmJson.data?.leaderName,
    registrationFee: confirmJson.data?.registrationFee,
    whatsappUrl: confirmJson.data?.whatsappUrl,
  });

  if (!confirmRes.ok || !confirmJson.success) {
    throw new Error("Confirmation lookup failed: " + JSON.stringify(confirmJson));
  }
  console.log("✓ Confirmation lookup succeeded for:", confirmJson.data?.registrationCode);

  // 3. Test GET /api/technex/:id
  console.log(`\n[Step 3] Testing GET /api/technex/${returnedRegId}...`);
  const directRes = await fetch(`http://localhost:3000/api/technex/${encodeURIComponent(returnedRegId)}`);
  const directJson = await directRes.json();
  console.log("Direct API status:", directRes.status);
  if (!directRes.ok || !directJson.success) {
    throw new Error("Direct lookup failed: " + JSON.stringify(directJson));
  }
  console.log("✓ Direct API lookup succeeded for:", directJson.data?.registrationCode);

  // 4. Test Success Page SSR HTML rendering
  console.log(`\n[Step 4] Testing GET /registration/success?id=${returnedRegId}...`);
  const pageRes = await fetch(`http://localhost:3000/registration/success?id=${encodeURIComponent(returnedRegId)}`);
  console.log("Success page status:", pageRes.status);
  const pageHtml = await pageRes.text();
  console.log("Page rendered HTML length:", pageHtml.length);
  if (!pageRes.ok) {
    throw new Error("Success page returned HTTP " + pageRes.status);
  }
  console.log("✓ Success page route loaded with 200 OK");

  // 5. Test Duplicate Prevention with fresh FormData
  console.log("\n[Step 5] Testing duplicate submission prevention...");
  const dupFormData = new FormData();
  dupFormData.append("membershipType", "S4DS Member");
  dupFormData.append("teamName", testTeamName);
  dupFormData.append("projectTitle", "Decentralized AI Medical Imaging");
  dupFormData.append("domain", "Artificial Intelligence & ML");
  dupFormData.append("abstractSummary", "Integrating neural networks with distributed edge devices.");
  dupFormData.append("githubOrDriveUrl", "https://github.com/s4ds/project-apex");
  dupFormData.append("leaderName", "Aarav Sharma");
  dupFormData.append("leaderEmail", testLeaderEmail);
  dupFormData.append("leaderPhone", "9876543210");
  dupFormData.append("leaderCollege", "MIT Academy of Engineering, Pune");
  dupFormData.append("leaderPrn", testLeaderPrn);
  dupFormData.append("teamMembers", "[]");
  dupFormData.append("utr", "123456789012");
  dupFormData.append("screenshot", new Blob([dummyBuffer], { type: "image/png" }), "payment-proof.png");

  const dupRes = await fetch("http://localhost:3000/api/technex", {
    method: "POST",
    body: dupFormData,
  });
  const dupJson = await dupRes.json();
  console.log("Duplicate submission status:", dupRes.status);
  console.log("Duplicate error message:", dupJson.error);
  if (dupRes.status !== 409) {
    throw new Error("Expected status 409 for duplicate submission, received: " + dupRes.status);
  }
  console.log("✓ Duplicate successfully blocked with 409 Conflict");

  // 6. Verify in RushDB
  console.log("\n[Step 6] Verifying record presence in RushDB directly...");
  const rushRecords = await findRecords("TECHNEX_REGISTRATION", {
    where: { registrationCode: returnedRegId },
  });
  console.log("RushDB matches count:", rushRecords.length);
  if (rushRecords.length === 0) {
    throw new Error(`Record ${returnedRegId} not found in RushDB!`);
  }
  console.log("✓ Verified record in RushDB:", {
    id: rushRecords[0].id,
    registrationCode: rushRecords[0].registrationCode,
    teamName: rushRecords[0].teamName,
    leaderEmail: rushRecords[0].leaderEmail,
    registrationFee: rushRecords[0].registrationFee,
  });

  console.log("\n=================================================");
  console.log("   ALL 6 END-TO-END VERIFICATION STEPS PASSED!");
  console.log("=================================================");
}

runEndToEndTest().catch((err) => {
  console.error("\n✗ Integration test failed:", err);
  process.exit(1);
});
