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

async function runAudit() {
  console.log("=================================================");
  console.log("   S4DS MITAOE DATABASE-DRIVEN COMPREHENSIVE AUDIT");
  console.log("=================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Dependency Check
  console.log("\n[1/10] Checking Architecture & Dependencies...");
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8"));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  assert(!allDeps.mongodb, "MongoDB is not present");
  assert(!allDeps.mongoose, "Mongoose is not present");
  assert(Boolean(allDeps.cloudinary), "Cloudinary is installed");
  assert(!allDeps["@supabase/supabase-js"], "Supabase is not present");
  assert(!allDeps["aws-sdk"] && !allDeps["@aws-sdk/client-s3"], "AWS S3 SDK is not present");
  assert(Boolean(allDeps["@rushdb/javascript-sdk"]), "RushDB SDK is installed");

  // 2. RushDB Connectivity & Labels
  console.log("\n[2/10] Testing RushDB Connection & Schema Catalog...");
  const { isRushDBConnected, getSchemaCatalog, findRecords } = require("../src/lib/rushdb");
  const connected = await isRushDBConnected();
  assert(connected, "RushDB is actively connected");

  const catalog = await getSchemaCatalog();
  console.log("  Labels discovered:", Array.from(catalog.labels));
  assert(catalog.labels.has("SETTING"), "Label 'SETTING' exists in RushDB");
  assert(catalog.labels.has("PROJECT"), "Label 'PROJECT' exists in RushDB");
  assert(catalog.labels.has("GALLERY_ITEM"), "Label 'GALLERY_ITEM' exists in RushDB");
  assert(catalog.labels.has("MEDIA_ITEM"), "Label 'MEDIA_ITEM' exists in RushDB");
  assert(catalog.labels.has("TEAM_MEMBER"), "Label 'TEAM_MEMBER' exists in RushDB");

  // 3. Centralized Settings in RushDB
  console.log("\n[3/10] Verifying Centralized Settings (getSettings)...");
  const { getSettings, updateSettings, getTechnexConfig, updateTechnexConfig } = require("../src/lib/db");
  const settings = await getSettings();
  assert(settings.websiteName === "S4DS MITAOE", `Settings websiteName retrieved: '${settings.websiteName}'`);
  assert(Boolean(settings.homepage?.heroHeadline), `Hero headline retrieved: '${settings.homepage?.heroHeadline}'`);
  assert(Boolean(settings.contactEmail), `Contact email retrieved: '${settings.contactEmail}'`);
  assert(Boolean(settings.about?.vision), `About vision retrieved: '${settings.about?.vision?.slice(0, 30)}...'`);
  assert(Boolean(settings.pageAvailability), "Page availability map exists");
  assert(typeof settings.pageAvailability?.technex === "boolean", "TECHNEX page availability is defined");

  // 4. Dynamic TECHNEX Configuration
  console.log("\n[4/10] Verifying Dynamic TECHNEX Configuration (getTechnexConfig)...");
  const technex = await getTechnexConfig();
  assert(Boolean(technex.title), `Technex title: '${technex.title}'`);
  assert(Boolean(technex.venue), `Technex venue: '${technex.venue}'`);
  assert(Boolean(technex.date), `Technex date: '${technex.date}'`);
  assert(Array.isArray(technex.membershipTiers) && technex.membershipTiers.length >= 2, "Membership tiers array has 2+ tiers");
  
  const s4dsTier = technex.membershipTiers.find((t) => t.id === "s4ds" || t.id === "s4ds_member");
  const nonS4dsTier = technex.membershipTiers.find((t) => t.id === "non-s4ds" || t.id === "non_s4ds_member");
  assert(s4dsTier && s4dsTier.fee === 49, `S4DS Member fee is ₹${s4dsTier?.fee}`);
  assert(nonS4dsTier && nonS4dsTier.fee === 99, `Non-S4DS Member fee is ₹${nonS4dsTier?.fee}`);
  assert(Array.isArray(technex.domains) && technex.domains.length >= 4, `Domains tracks configured: ${technex.domains.length}`);
  assert(Boolean(technex.whatsappUrl), `WhatsApp invitation URL: '${technex.whatsappUrl}'`);

  // 5. Payment QR Resolution from MEDIA_ITEM
  console.log("\n[5/10] Verifying Dynamic Active Payment QR Resolution...");
  assert(Boolean(technex.activePaymentQrUrl), `Active Payment QR URL resolved: '${technex.activePaymentQrUrl}'`);
  assert(Boolean(technex.activePaymentQrId), `Active Payment QR Media ID: '${technex.activePaymentQrId}'`);

  // 6. Server-Side Fee Enforcement Simulation
  console.log("\n[6/10] Testing Server-Side Dynamic Fee Calculation...");
  function calculateFee(membershipType, tiers) {
    const tier = tiers.find(
      (t) =>
        t.name?.toLowerCase() === membershipType?.toLowerCase() ||
        t.id?.toLowerCase() === membershipType?.toLowerCase()
    );
    return tier ? tier.fee : null;
  }
  const fee1 = calculateFee("S4DS Member", technex.membershipTiers);
  const fee2 = calculateFee("Non-S4DS Member", technex.membershipTiers);
  const feeInvalid = calculateFee("Random Tier", technex.membershipTiers);
  assert(fee1 === 49, `Calculated fee for 'S4DS Member' is ₹${fee1}`);
  assert(fee2 === 99, `Calculated fee for 'Non-S4DS Member' is ₹${fee2}`);
  assert(feeInvalid === null, "Invalid tier calculation correctly rejected");

  // 7. Cloudinary Storage Configuration
  console.log("\n[7/10] Verifying Cloudinary Storage Client...");
  const cloudinaryModule = require("../src/lib/cloudinary");
  assert(Boolean(cloudinaryModule.uploadToCloudinary), "uploadToCloudinary is exported");
  assert(Boolean(cloudinaryModule.deleteFromCloudinary), "deleteFromCloudinary is exported");
  assert(Boolean(cloudinaryModule.getSignedUrl), "getSignedUrl is exported");

  // 8. Projects Data in RushDB
  console.log("\n[8/10] Verifying Projects in RushDB...");
  const { getProjects } = require("../src/lib/db");
  const projects = await getProjects();
  assert(Array.isArray(projects) && projects.length >= 4, `Projects in RushDB: ${projects.length}`);

  // 9. Gallery Items in RushDB
  console.log("\n[9/10] Verifying Gallery in RushDB...");
  const { getGallery } = require("../src/lib/db");
  const gallery = await getGallery();
  assert(Array.isArray(gallery) && gallery.length >= 4, `Gallery items in RushDB: ${gallery.length}`);

  // 10. Team Members in RushDB
  console.log("\n[10/10] Verifying Team in RushDB...");
  const { getTeam } = require("../src/lib/db");
  const team = await getTeam();
  assert(Array.isArray(team) && team.length >= 10, `Team members in RushDB: ${team.length}`);

  console.log("\n=================================================");
  console.log(`AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error("Audit threw exception:", err);
  process.exit(1);
});
