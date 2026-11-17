import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
let cloudName = (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dmy7cmuq9").trim();
if (cloudName.toLowerCase().startsWith("s4ds") || cloudName.includes(" ")) {
  const nextPublic = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").trim();
  cloudName = nextPublic && !nextPublic.toLowerCase().startsWith("s4ds") && !nextPublic.includes(" ") ? nextPublic : "dmy7cmuq9";
}
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export const ROOT_FOLDER = "S4DS";
export const TARGET_FOLDER = "S4DS";

export const CATEGORY_FOLDERS = {
  "payment-qr": `${ROOT_FOLDER}/payment-qr`,
  "payment-screenshot": `${ROOT_FOLDER}/payment-screenshots`,
  "event-poster": `${ROOT_FOLDER}/events`,
  "event-gallery": `${ROOT_FOLDER}/gallery`,
  "team-profile": `${ROOT_FOLDER}/team`,
  "project-image": `${ROOT_FOLDER}/projects`,
  "website-banner": `${ROOT_FOLDER}/banners`,
  "logo": `${ROOT_FOLDER}/logos`,
  "document": `${ROOT_FOLDER}/documents`,
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

/**
 * Resolves the structured subfolder inside the S4DS root folder.
 */
export function resolveSubfolder(category = "general", customSubfolder = null) {
  if (customSubfolder) {
    const cleanSub = customSubfolder.replace(/^\/+|\/+$/g, "");
    return cleanSub.startsWith(ROOT_FOLDER) ? cleanSub : `${ROOT_FOLDER}/${cleanSub}`;
  }
  if (CATEGORY_FOLDERS[category]) {
    return CATEGORY_FOLDERS[category];
  }
  const cleanCat = (category || "general").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
  return `${ROOT_FOLDER}/${cleanCat || "general"}`;
}

/**
 * Uploads a file buffer to Cloudinary inside the designated subfolder of 'S4DS'.
 */
export async function uploadToCloudinary({
  fileBuffer,
  fileName,
  mimeType = "image/png",
  category = "event-poster",
  subfolder = null,
  folder = null,
  isPrivate = false,
}) {
  const targetFolder = folder
    ? (folder.startsWith(ROOT_FOLDER) ? folder : `${ROOT_FOLDER}/${folder.replace(/^\/+/, "")}`)
    : resolveSubfolder(category, subfolder);
  const sanitizedBaseName = (fileName ? fileName.replace(/\.[^/.]+$/, "") : "media")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 50);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const uniqueId = `${Date.now()}_${sanitizedBaseName}_${randomSuffix}`;
  const isPdf = mimeType === "application/pdf" || (fileName && fileName.endsWith(".pdf"));
  const resourceType = isPdf ? "raw" : "auto";
  const isSensitive = Boolean(isPrivate);

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      public_id: uniqueId,
      folder: targetFolder,
      asset_folder: targetFolder,
      resource_type: resourceType,
      overwrite: false,
      unique_filename: true,
      use_filename: true,
      tags: ["S4DS", category].filter(Boolean),
    };

    if (isSensitive) {
      uploadOptions.type = "authenticated";
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }

        let fileUrl = result.secure_url || result.url;
        if (isSensitive) {
          fileUrl = getSignedUrl(result.public_id, 86400 * 365, resourceType);
        }

        resolve({
          public_id: result.public_id,
          publicId: result.public_id,
          storagePath: result.public_id,
          fullPath: result.public_id,
          fileUrl,
          secure_url: result.secure_url || result.url,
          folder: targetFolder,
          asset_folder: result.asset_folder || targetFolder,
          isPrivate: isSensitive,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Generates an authenticated / signed URL with expiration for private assets.
 */
export function getSignedUrl(publicId, expiresInSeconds = 3600, resourceType = "image") {
  try {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    return cloudinary.utils.private_download_url(publicId, "", {
      resource_type: resourceType,
      type: "authenticated",
      expires_at: expiresAt,
    });
  } catch (err) {
    // Fallback standard HTTPS secure URL
    return cloudinary.url(publicId, {
      secure: true,
      resource_type: resourceType,
    });
  }
}

/**
 * Deletes an asset from Cloudinary.
 */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: resourceType, invalidate: true },
      (error, result) => {
        if (error) {
          console.error("Cloudinary destroy error:", error);
          return reject(new Error(`Failed to delete from Cloudinary: ${error.message}`));
        }
        resolve(result);
      }
    );
  });
}

/**
 * Lists resources in a specific Cloudinary prefix / folder.
 */
export async function listCloudinaryFiles(folder, maxResults = 100) {
  try {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: maxResults,
    });
    return res.resources || [];
  } catch (err) {
    console.warn("listCloudinaryFiles notice:", err.message);
    return [];
  }
}

// Backward-compatible aliases for seamless transition
export const uploadToSupabase = uploadToCloudinary;
export const deleteFromSupabase = deleteFromCloudinary;
export const listSupabaseFiles = listCloudinaryFiles;
export const BUCKET_NAME = "cloudinary-media";

export default cloudinary;
