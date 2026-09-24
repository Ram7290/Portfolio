import {
  badRequest,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  unauthorized,
} from "@/lib/api-utils";
import { destroyImage, isCloudinaryConfigured, uploadImage } from "@/lib/cloudinary";

/**
 * Cloudinary upload endpoints — restricted to the profile picture and
 * project thumbnails. Returns the hosted URL + publicId for MongoDB storage.
 */

export interface UploadResponse {
  url: string;
  publicId: string;
}

/** POST /api/upload — upload an image to Cloudinary (admin only) */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "projects");

    if (!(file instanceof File) || file.size === 0) {
      return badRequest("No image selected.");
    }
    if (folder !== "profile" && folder !== "projects") {
      return badRequest("Invalid upload folder. Must be 'profile' or 'projects'.");
    }
    if (!isCloudinaryConfigured()) {
      return badRequest(
        "Cloudinary is not configured. Add CLOUDINARY_* environment variables.",
      );
    }

    const result = await uploadImage(file, folder as "profile" | "projects");
    revalidatePaths(["/admin"]);
    return success<UploadResponse>(result);
  } catch (error) {
    return serverError(
      error instanceof Error ? error.message : "Upload failed. Try again.",
    );
  }
}

/** DELETE /api/upload — remove an image from Cloudinary (admin only) */
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  try {
    const body = await request.json();
    const publicId = body.publicId;

    if (!publicId) return badRequest("Missing publicId.");

    await destroyImage(publicId);
    return success();
  } catch (error) {
    return serverError("Failed to remove image.");
  }
}
