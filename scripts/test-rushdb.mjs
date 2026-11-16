import fs from "fs";
import { getRushDBClient } from "../src/lib/rushdb.js";

const env = fs.readFileSync(".env", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.trim().split("=");
  if (k && !k.startsWith("#")) {
    process.env[k.trim()] = v.join("=").trim().replace(/^['"]|['"]$/g, "");
  }
}

async function run() {
  const client = await getRushDBClient();
  const existing = await client.records.find({ labels: ["SETTING"] });
  const records = Array.isArray(existing) ? existing : existing?.data || [];
  console.log("Existing SETTING count:", records.length);
  const internalId = records[0].id;
  console.log("SETTING internal ID:", internalId);

  // Update with flat properties including stringified JSON
  const flatData = {
    websiteName: "S4DS MITAOE",
    websiteTagline: "Think. Analyze. Innovate.",
    technexJson: JSON.stringify({
      title: "TECHNEX 2K26 – THE PROJECT EXPO",
      registrationFee: 49
    })
  };

  const updated = await client.records.update({
    target: internalId,
    label: "SETTING",
    data: flatData
  });
  console.log("Updated result:", updated);

  const refetched = await client.records.find({ labels: ["SETTING"] });
  const r2 = Array.isArray(refetched) ? refetched : refetched?.data || [];
  console.log("Refetched data:", r2[0]?.data);
}

run().catch(console.error);
