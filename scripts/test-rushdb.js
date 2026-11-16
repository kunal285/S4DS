import { isRushDBConnected, getSchemaCatalog, getRushDBClient } from "../src/lib/rushdb.js";

async function main() {
  console.log("==========================================");
  console.log("   S4DS MITAOE — RushDB Diagnostic Check  ");
  console.log("==========================================\n");

  const apiKey = process.env.RUSHDB_API_KEY;
  const mode = process.env.RUSHDB_MODE || "direct";
  const engineUrl = process.env.RUSHDB_ENGINE_URL || "http://127.0.0.1:3000";

  console.log("Environment Configuration:");
  console.log(`- Mode: ${apiKey ? "RushDB Cloud" : `Direct Engine (${mode})`}`);
  console.log(`- Engine URL: ${engineUrl}`);
  console.log(`- API Key: ${apiKey ? `${apiKey.slice(0, 8)}...` : "(none provided - direct engine mode)"}`);

  const connected = await isRushDBConnected();
  console.log(`\nRushDB Connection Status: ${connected ? "CONNECTED (Online)" : "STANDBY (Engine unreachable or credentials pending)"}`);

  if (connected) {
    try {
      console.log("\nReading Schema Catalog (labels, properties, types, relationship shapes)...");
      const catalog = await getSchemaCatalog(true);
      console.log("- Labels in Catalog:", Array.from(catalog.labels));
      console.log("- Relationships in Catalog:", catalog.relationships);

      const client = await getRushDBClient();
      const markdown = await client.ai.getSchemaMarkdown();
      console.log("\nSchema Catalog Markdown Summary:");
      console.log(markdown);
    } catch (err) {
      console.error("Error reading schema catalog:", err.message);
    }
  } else {
    console.log("\nTo connect RushDB:");
    console.log("1. RushDB Cloud: set RUSHDB_API_KEY in .env (get a key from https://app.rushdb.com)");
    console.log("2. Local Engine: run `curl -fsSL https://rushdb.com/install.sh | sh && rushdb up` (or start via Docker)");
    console.log("   Direct mode default: http://127.0.0.1:3000, token: local-token");
  }
}

main();
