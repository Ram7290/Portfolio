import "server-only";

import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary is used ONLY for the profile picture and project
 * thumbnails (per project spec). Uploads go through the server action
 * in the /api/upload route; MongoDB stores only the resulting URL.
 */

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

/**
 * The dashboard also shows a combined URL:
 *   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
 * Either format works — the three separate vars take precedence.
 */
const cloudinaryUrl = process.env.CLOUDINARY_URL;

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    (cloudName && apiKey && apiSecret) ||
      (cloudinaryUrl && !cloudinaryUrl.includes("<your_api_key>")),
  );
}

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
} else if (isCloudinaryConfigured()) {
  cloudinary.config(); // reads CLOUDINARY_URL from the environment
}

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadImage(
  file: File,
  folder: "profile" | "projects",
): Promise<UploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_* env vars.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large. Maximum size is 4 MB.");
  }
  if (file.type && !ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Unsupported image type. Use JPEG, PNG, WebP, or GIF.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${folder}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error("Upload failed. Please try again."));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

export async function destroyImage(publicId: string): Promise<void> {
  if (!isCloudinaryConfigured() || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("[cloudinary] destroy failed:", error);
  }
}
