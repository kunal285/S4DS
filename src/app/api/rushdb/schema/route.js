import { NextResponse } from "next/server";
import { getRushDBClient, getSchemaCatalog, isRushDBConnected } from "@/lib/rushdb";

export async function GET(request) {
  try {
    const connected = await isRushDBConnected();
    if (!connected) {
      return NextResponse.json({
        success: false,
        connected: false,
        message:
          "RushDB is not reachable. To connect, set RUSHDB_API_KEY in .env (for RushDB Cloud) or start a local engine at RUSHDB_ENGINE_URL (direct mode).",
      });
    }

    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";
    const catalog = await getSchemaCatalog(force);

    const client = await getRushDBClient();
    let schemaMarkdown = "";
    try {
      schemaMarkdown = await client.ai.getSchemaMarkdown();
    } catch (e) {
      schemaMarkdown = "Schema markdown generation not available in current mode.";
    }

    return NextResponse.json({
      success: true,
      connected: true,
      catalog: {
        labels: Array.from(catalog.labels || []),
        properties: catalog.propertiesByLabel || {},
        relationships: catalog.relationships || [],
      },
      markdown: schemaMarkdown,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
