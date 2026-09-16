"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { destroyImage, isCloudinaryConfigured, uploadImage } from "@/lib/cloudinary";

import type { ActionResult } from "./profile";

/**
 * Cloudinary upload action — restricted to the profile picture and
 * project thumbnails. Returns the hosted URL for MongoDB storage.
 */

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

export type UploadActionResult =
  | { ok: true; url: string; publicId: string }
  | { ok: false; error: string };

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");

  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "projects");

  if (!(file instanceof File) || file.size === 0) {
    return fail("No image selected.");
  }
  if (folder !== "profile" && folder !== "projects") {
    return fail("Invalid upload folder.");
  }
  if (!isCloudinaryConfigured()) {
    return fail(
      "Cloudinary is not configured. Add CLOUDINARY_* environment variables.",
    );
  }

  try {
    const { url, publicId } = await uploadImage(file, folder);
    revalidatePath("/admin");
    return { ok: true, url, publicId };
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Upload failed. Try again.",
    );
  }
}

export async function removeImageAction(
  publicId: string,
): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  await destroyImage(publicId);
  return { ok: true };
}
