import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "s4ds-mitaoe";
const apiKey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export const CATEGORY_FOLDERS = {
  "payment-qr": "s4ds/payment/qr-codes",
  "payment-screenshot": "s4ds/payment/screenshots",
  "event-poster": "s4ds/events/posters",
  "event-gallery": "s4ds/events/gallery",
  "team-profile": "s4ds/team/profiles",
  "project-image": "s4ds/projects/thumbnails",
  "website-banner": "s4ds/website/banners",
  "logo": "s4ds/website/logos",
  "document": "s4ds/documents/resources",
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
 * Uploads a file buffer to Cloudinary.
 */
export async function uploadToCloudinary({
  fileBuffer,
  fileName,
  mimeType = "image/png",
  category = "event-poster",
  isPrivate = false,
}) {
  const folder = CATEGORY_FOLDERS[category] || "s4ds/general";
  const sanitizedBaseName = (fileName ? fileName.replace(/\.[^/.]+$/, "") : "media")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniquePublicId = `${folder}/${Date.now()}_${sanitizedBaseName}`;
  const isPdf = mimeType === "application/pdf" || (fileName && fileName.endsWith(".pdf"));
  const resourceType = isPdf ? "raw" : "image";
  const isSensitive = isPrivate || category === "payment-screenshot" || category === "document";

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      public_id: uniquePublicId,
      resource_type: resourceType,
      overwrite: true,
      tags: ["s4ds", category],
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
          fileUrl = getSignedUrl(result.public_id, 3600, resourceType);
        }

        resolve({
          storagePath: result.public_id,
          fullPath: result.public_id,
          fileUrl,
          folder,
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
