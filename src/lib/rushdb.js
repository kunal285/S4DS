// Cache for schema catalog
let cachedCatalog = null;
let lastCatalogFetch = 0;
const CATALOG_TTL = 60 * 1000; // 1 minute in-memory cache

let RushDBClass = null;

async function getRushDBClass() {
  if (!RushDBClass) {
    try {
      // Use dynamic runtime import so Webpack does not attempt static chunking
      const loadModule = new Function("specifier", "return import(specifier)");
      const mod = await loadModule("@rushdb/javascript-sdk");
      RushDBClass = mod.default || mod;
    } catch (e) {
      RushDBClass = null;
    }
  }
  return RushDBClass;
}

/**
 * Returns a configured RushDB client instance.
 * Connects to RushDB Cloud (if RUSHDB_API_KEY is present)
 * or RushDB local standalone engine (direct mode).
 */
export async function getRushDBClient() {
  const RushDB = await getRushDBClass();
  if (!RushDB) return null;

  const apiKey = process.env.RUSHDB_API_KEY;
  const mode = process.env.RUSHDB_MODE || "direct";
  const engineUrl = process.env.RUSHDB_ENGINE_URL || "http://127.0.0.1:3000";
  const engineToken = process.env.RUSHDB_ENGINE_TOKEN || "local-token";

  if (apiKey && apiKey.trim().length > 0) {
    return new RushDB(apiKey.trim());
  }

  if (mode === "direct" || engineUrl) {
    return new RushDB(engineToken, {
      direct: true,
      engineUrl,
    });
  }

  return null;
}

/**
 * Check if RushDB engine or cloud is reachable.
 */
export async function isRushDBConnected() {
  try {
    const client = await getRushDBClient();
    if (!client) return false;
    await client.ai.getSchema();
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * MANDATORY RULE: Read schema catalog before writing any query.
 * Fetches labels, properties, data types, and relationship shapes.
 */
export async function getSchemaCatalog(force = false) {
  const client = await getRushDBClient();
  if (!client) {
    throw new Error("RushDB client is not configured.");
  }

  const now = Date.now();
  if (!force && cachedCatalog && now - lastCatalogFetch < CATALOG_TTL) {
    return cachedCatalog;
  }

  try {
    const schema = await client.ai.getSchema();
    cachedCatalog = {
      raw: schema,
      labels: new Set(),
      propertiesByLabel: {},
      relationships: [],
    };

    if (schema) {
      const items = Array.isArray(schema.data) ? schema.data : Array.isArray(schema) ? schema : [];
      items.forEach((item) => {
        if (item.label) {
          cachedCatalog.labels.add(item.label);
          if (item.properties) {
            cachedCatalog.propertiesByLabel[item.label] = item.properties;
          }
          if (item.relationships && Array.isArray(item.relationships)) {
            cachedCatalog.relationships.push(...item.relationships);
          }
        }
      });

      if (Array.isArray(schema.labels)) {
        schema.labels.forEach((l) => {
          const name = typeof l === "string" ? l : l.name;
          if (name) cachedCatalog.labels.add(name);
        });
      } else if (typeof schema.labels === "object" && schema.labels !== null) {
        Object.keys(schema.labels).forEach((k) => cachedCatalog.labels.add(k));
      }

      if (schema.properties) {
        cachedCatalog.propertiesByLabel = {
          ...cachedCatalog.propertiesByLabel,
          ...schema.properties,
        };
      }
      if (schema.relationships && Array.isArray(schema.relationships)) {
        cachedCatalog.relationships.push(...schema.relationships);
      }
    }

    lastCatalogFetch = now;
    return cachedCatalog;
  } catch (err) {
    throw new Error(`Failed to load RushDB schema catalog: ${err.message}`);
  }
}

/**
 * Validates that requested fields exist in the schema catalog before executing a query.
 */
export async function validateFieldsExist(label, fields = []) {
  const catalog = await getSchemaCatalog();
  if (!catalog.labels.has(label)) {
    return { valid: false, reason: `Label '${label}' does not exist in RushDB schema catalog.` };
  }

  const labelProps = catalog.propertiesByLabel[label] || [];
  const existingPropNames = new Set(
    Array.isArray(labelProps)
      ? labelProps.map((p) => (typeof p === "string" ? p : p.name))
      : Object.keys(labelProps)
  );

  const missing = fields.filter((f) => !existingPropNames.has(f));
  if (missing.length > 0) {
    return {
      valid: false,
      reason: `Fields [${missing.join(", ")}] do not exist under label '${label}' in RushDB schema catalog.`,
    };
  }

  return { valid: true };
}

/**
 * Safe Record Finder enforcing schema-first discovery.
 */
export async function findRecords(label, options = {}) {
  const client = await getRushDBClient();
  if (!client) throw new Error("RushDB not configured");

  // Read schema catalog first (Mandatory workflow)
  await getSchemaCatalog();

  const queryPayload = {
    labels: [label],
  };

  if (options.where) {
    queryPayload.where = options.where;
  }
  if (options.limit) {
    queryPayload.limit = options.limit;
  }
  if (options.orderBy) {
    queryPayload.orderBy = options.orderBy;
  }

  const result = await client.records.find(queryPayload);
  const records = Array.isArray(result) ? result : result?.data || [];

  return records.map((r) => (r.data ? { id: r.id, ...r.data } : r));
}

/**
 * Safe Single Record Finder
 */
export async function findRecordById(label, id) {
  const client = await getRushDBClient();
  if (!client) throw new Error("RushDB not configured");

  await getSchemaCatalog();

  // Try direct lookup by RushDB internal ID if id is a UUID
  if (typeof id === "string" && /^[0-9a-fA-F-]{36}$/.test(id)) {
    try {
      const direct = await client.records.findById(id);
      if (direct) {
        return direct.data ? { id: direct.id, ...direct.data } : direct;
      }
    } catch (e) {
      // Fall through to query by where: { id }
    }
  }

  const result = await client.records.find({
    labels: [label],
    where: { id },
    limit: 1,
  });

  const records = Array.isArray(result) ? result : result?.data || [];
  if (records.length === 0) return null;

  const r = records[0];
  return r.data ? { id: r.id, ...r.data } : r;
}

/**
 * Safe Record Creator
 */
export async function createRecord(label, data) {
  const client = await getRushDBClient();
  if (!client) throw new Error("RushDB not configured");

  // If data contains nested objects/arrays of objects, use importJson
  const hasNestedObjects = Object.values(data).some(
    (v) => typeof v === "object" && v !== null && (Array.isArray(v) ? v.some((item) => typeof item === "object" && item !== null) : true)
  );

  let res;
  if (hasNestedObjects) {
    res = await client.records.importJson({
      label,
      data,
    });
  } else {
    res = await client.records.create({
      label,
      data,
    });
  }

  cachedCatalog = null;
  return res.data ? { id: res.id, ...res.data } : res;
}

/**
 * Safe Record Updater
 */
export async function updateRecord(label, id, updates) {
  const client = await getRushDBClient();
  if (!client) throw new Error("RushDB not configured");

  let internalId = null;
  if (typeof id === "string" && /^[0-9a-fA-F-]{36}$/.test(id)) {
    internalId = id;
  } else {
    const existing = await client.records.find({
      labels: [label],
      where: { id },
      limit: 1,
    });
    const records = Array.isArray(existing) ? existing : existing?.data || [];
    if (records.length > 0) {
      internalId = records[0].id;
    }
  }

  if (!internalId) return null;

  const res = await client.records.update({
    target: internalId,
    label,
    data: updates,
  });
  cachedCatalog = null;
  return res.data ? { id: res.id, ...res.data } : res;
}

/**
 * Safe Record Deleter
 */
export async function deleteRecord(label, id) {
  const client = await getRushDBClient();
  if (!client) throw new Error("RushDB not configured");

  let internalId = null;
  if (typeof id === "string" && /^[0-9a-fA-F-]{36}$/.test(id)) {
    internalId = id;
  } else {
    const existing = await client.records.find({
      labels: [label],
      where: { id },
      limit: 1,
    });
    const records = Array.isArray(existing) ? existing : existing?.data || [];
    if (records.length > 0) {
      internalId = records[0].id;
    }
  }

  if (!internalId) return false;

  await client.records.deleteById(internalId);
  return true;
}

/**
 * Bootstraps initial seed schema and records into RushDB if empty.
 */
export async function bootstrapRushDBSchema(seedData) {
  const client = await getRushDBClient();
  if (!client) return false;

  try {
    const catalog = await getSchemaCatalog(true);

    if (!catalog.labels.has("EVENT") && seedData.events?.length) {
      for (const evt of seedData.events) {
        await client.records.create({ label: "EVENT", data: evt });
      }
    }

    if (!catalog.labels.has("TEAM_MEMBER") && seedData.team?.length) {
      for (const tm of seedData.team) {
        await client.records.create({ label: "TEAM_MEMBER", data: tm });
      }
    }

    if (!catalog.labels.has("PROJECT") && seedData.projects?.length) {
      for (const proj of seedData.projects) {
        await client.records.create({ label: "PROJECT", data: proj });
      }
    }

    if (!catalog.labels.has("GALLERY_ITEM") && seedData.gallery?.length) {
      for (const item of seedData.gallery) {
        await client.records.create({ label: "GALLERY_ITEM", data: item });
      }
    }

    if (!catalog.labels.has("ADMIN") && seedData.admins?.length) {
      for (const adm of seedData.admins) {
        await client.records.create({ label: "ADMIN", data: adm });
      }
    }

    if (!catalog.labels.has("MEDIA_ITEM") && seedData.mediaItems?.length) {
      for (const m of seedData.mediaItems) {
        await client.records.create({ label: "MEDIA_ITEM", data: m });
      }
    }

    if (!catalog.labels.has("SETTING") && seedData.settings) {
      await client.records.create({ label: "SETTING", data: { id: "site-settings", ...seedData.settings } });
    }

    await getSchemaCatalog(true);
    return true;
  } catch (err) {
    console.error("Bootstrap RushDB error:", err);
    return false;
  }
}
