import "server-only";

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";

/**
 * Shared utilities for API route handlers.
 * - Authentication check
 * - Standardized response formats
 * - Revalidation helper
 */

export type ApiResponse<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

/**
 * Check if the current session has admin access.
 * Returns true if authenticated, false otherwise.
 */
export async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}

/**
 * Return a 401 Unauthorized response.
 */
export function unauthorized(message = "Not authorized") {
  return NextResponse.json<ApiResponse>(
    { ok: false, error: message },
    { status: 401 },
  );
}

/**
 * Return a 400 Bad Request response.
 */
export function badRequest(error: string) {
  return NextResponse.json<ApiResponse>(
    { ok: false, error },
    { status: 400 },
  );
}

/**
 * Return a 500 Internal Server Error response.
 */
export function serverError(error: string = "Internal server error") {
  return NextResponse.json<ApiResponse>(
    { ok: false, error },
    { status: 500 },
  );
}

/**
 * Return a success response with optional data.
 */
export function success<T>(data?: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { ok: true, data },
    { status },
  );
}

/**
 * Revalidate multiple paths at once.
 */
export function revalidatePaths(paths: string[]) {
  paths.forEach((path) => revalidatePath(path));
}

/**
 * Helper to safely parse JSON request body.
 */
export async function parseRequestBody<T>(request: Request): Promise<T | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
