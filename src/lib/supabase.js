import { createClient } from "@supabase/supabase-js";

// Exact Supabase environment variables (New API key format)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cflqsjjkekfrnjjbhuja.supabase.co";
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || "";

export const BUCKET_NAME = "s4ds-media";

export const CATEGORY_FOLDERS = {
  "payment-qr": "payment/qr-codes",
  "payment-screenshot": "payment/screenshots",
  "event-poster": "events/posters",
  "event-gallery": "events/gallery",
  "team-profile": "team/profiles",
  "project-image": "projects/thumbnails",
  "website-banner": "website/banners",
  "logo": "website/logos",
  "document": "documents/resources",
};

export const CATEGORY_LABELS = {
  "payment-qr": "Payment QR Codes",
  "payment-screenshot": "Payment Screenshots",
  "event-poster": "Event Posters",
  "event-gallery": "Event Gallery",
  "team-profile": "Team Profiles",
  "project-image": "Project Images",
  "website-banner": "Website Banners",
  "logo": "Logos",
  "document": "Documents",
};

let serverClient = null;
let browserClient = null;

/**
 * Server-side client using SUPABASE_SECRET_KEY (sb_secret_...)
 * NEVER expose or invoke this on the client / browser bundle.
 */
export function getSupabaseServerClient() {
  if (!serverClient) {
    if (!supabaseUrl || !supabaseSecretKey) {
      throw new Error("SUPABASE_SECRET_KEY or NEXT_PUBLIC_SUPABASE_URL is not configured.");
    }
    serverClient = createClient(supabaseUrl, supabaseSecretKey, {
      auth: { persistSession: false },
    });
  }
  return serverClient;
}

// Backward-compatible alias for existing server routes
export const getSupabaseAdmin = getSupabaseServerClient;

/**
 * Browser-side client using NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (sb_publishable_...)
 */
export function getSupabaseBrowserClient() {
  if (!browserClient) {
    if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_URL is not configured.");
    }
    browserClient = createClient(supabaseUrl, supabasePublishableKey);
  }
  return browserClient;
}

// Backward-compatible alias for browser client
export const getSupabasePublic = getSupabaseBrowserClient;

/**
 * Ensures the s4ds-media bucket exists.
 */
export async function ensureBucketExists() {
  try {
    const supabase = getSupabaseServerClient();
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.warn("Error listing Supabase buckets:", error.message);
      return false;
    }
    const exists = buckets.some((b) => b.name === BUCKET_NAME);
    if (!exists) {
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
      });
      if (createError) {
        console.warn("Error creating Supabase bucket:", createError.message);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn("ensureBucketExists notice:", err.message);
    return false;
  }
}

/**
 * Uploads a file buffer to Supabase Storage using the server secret key.
 */
export async function uploadToSupabase({
  fileBuffer,
  fileName,
  mimeType = "image/png",
  category = "event-poster",
  isPrivate = false,
}) {
  await ensureBucketExists();
  const supabase = getSupabaseServerClient();

  const folder = CATEGORY_FOLDERS[category] || "general";
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueName = `${Date.now()}_${sanitizedName}`;
  const storagePath = `${folder}/${uniqueName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const isSensitive = isPrivate || category === "payment-screenshot" || category === "document";
  let fileUrl = "";

  if (isSensitive) {
    // Generate signed URL valid for 1 hour for protected private assets
    const { data: signData, error: signErr } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, 60 * 60);
    if (signErr) {
      throw new Error(`Failed to generate signed URL for private asset: ${signErr.message}`);
    }
    fileUrl = signData?.signedUrl || "";
  } else {
    // Public CDN URL for regular website assets
    const { data: pubData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);
    fileUrl = pubData.publicUrl;
  }

  return {
    storagePath,
    fullPath: data.fullPath,
    fileUrl,
    folder,
    isPrivate: isSensitive,
  };
}

/**
 * Generates a fresh signed URL for a private file.
 */
export async function getSignedUrl(storagePath, expiresInSeconds = 3600) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
  return data.signedUrl;
}

/**
 * Deletes a file from Supabase Storage.
 */
export async function deleteFromSupabase(storagePath) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);
  if (error) {
    throw new Error(`Failed to delete from Supabase: ${error.message}`);
  }
  return true;
}

/**
 * Lists files in a given Supabase Storage folder.
 */
export async function listSupabaseFiles(folder) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });
  if (error) {
    throw new Error(`Failed to list files in ${folder}: ${error.message}`);
  }
  return data || [];
}
