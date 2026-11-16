import { initRushDB, getSchemaCatalog, getRushDBClient } from "../src/lib/db.js";

async function main() {
  console.log("Seeding RushDB with S4DS initial datasets...");
  const success = await initRushDB();
  console.log(`Bootstrap result: ${success ? "SUCCESS" : "FAILED"}`);

  console.log("\nFetching updated schema catalog...");
  const catalog = await getSchemaCatalog(true);
  console.log("Active Labels in RushDB:", Array.from(catalog.labels));
  console.log("Labels properties breakdown:", Object.keys(catalog.propertiesByLabel));

  const client = await getRushDBClient();
  const summary = await client.ai.getSchemaMarkdown();
  console.log("\nSchema Markdown:");
  console.log(summary.data || summary);
}

main();
