import { NextResponse } from "next/server";
import path from "path";
import { uploadToCloudinary, CATEGORY_FOLDERS } from "@/lib/cloudinary";
import { createMediaItem } from "@/lib/db";

// Allowed file types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const category = formData.get("category") || "event-poster";
    const subfolder = formData.get("subfolder") || null;
    const title = formData.get("title") || "";
    const associatedRecordId = formData.get("associatedRecordId") || null;
    const isActive = formData.get("isActive") === "true";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed types are PNG, JPG, WEBP, GIF, SVG, and PDF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds the maximum allowed size of 10MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 1. Upload file to Cloudinary Storage inside the S4DS subfolder
    const isPrivate = category === "payment-screenshot" || category === "document";
    const uploadResult = await uploadToCloudinary({
      fileBuffer,
      fileName: file.name,
      mimeType: file.type,
      category,
      subfolder,
      isPrivate,
    });

    // 2. Save metadata and reference in RushDB (MEDIA_ITEM label)
    const mediaRecord = await createMediaItem({
      title: title || file.name,
      fileName: file.name,
      category,
      folder: uploadResult.folder,
      storagePath: uploadResult.public_id || uploadResult.storagePath,
      publicId: uploadResult.public_id || uploadResult.storagePath,
      fileUrl: uploadResult.secure_url || uploadResult.fileUrl,
      secureUrl: uploadResult.secure_url || uploadResult.fileUrl,
      fileSize: file.size,
      mimeType: file.type,
      isPrivate: uploadResult.isPrivate,
      isActive,
      associatedRecordId,
    });

    return NextResponse.json({
      success: true,
      message: `File uploaded to Cloudinary folder '${uploadResult.folder}' and registered in RushDB successfully.`,
      url: uploadResult.secure_url || uploadResult.fileUrl,
      fileUrl: uploadResult.secure_url || uploadResult.fileUrl,
      secureUrl: uploadResult.secure_url || uploadResult.fileUrl,
      publicId: uploadResult.public_id,
      storagePath: uploadResult.public_id || uploadResult.storagePath,
      folder: uploadResult.folder,
      mediaId: mediaRecord.id,
      media: mediaRecord,
      fileName: file.name,
      size: file.size,
      type: file.type,
      category,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload file to Cloudinary." },
      { status: 500 }
    );
  }
}
