import "server-only";

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";

import { auth, type AdminIdentity } from "@/lib/auth";
import { verifyApiToken } from "@/lib/api-token";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";

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
 * The signed-in admin, from either:
 * - `Authorization: Bearer <token>` — the mobile app (see api-token.ts), or
 * - the Auth.js session cookie — the web admin.
 * A request that sends an Authorization header is judged on it alone.
 */
export async function getAdmin(): Promise<AdminIdentity | null> {
  const authorization = (await headers()).get("authorization");
  if (authorization !== null) {
    const [scheme, token] = authorization.trim().split(/\s+/);
    return scheme?.toLowerCase() === "bearer" && token
      ? verifyApiToken(token)
      : null;
  }

  const session = await auth();
  if (!session?.user) return null;
  return {
    id: session.user.id ?? "",
    name: session.user.name ?? "",
    email: session.user.email ?? "",
  };
}

/**
 * Check if the request comes from a signed-in admin (app token or web session).
 * Returns true if authenticated, false otherwise.
 */
export async function requireAdmin(): Promise<boolean> {
  return (await getAdmin()) !== null;
}

/**
 * Why sign-in can't work right now, or null when it can — so configuration
 * problems are reported honestly instead of blaming the credentials.
 */
export async function loginConfigError(): Promise<string | null> {
  if (!isDbConfigured()) {
    return "Server is not configured: MONGODB_URI is missing. Add it to this deployment's environment variables and redeploy.";
  }

  // A sign-in attempt deserves a real connection attempt, not a cached failure
  if (!(await connectToDatabase({ bypassCooldown: true }))) {
    return "Cannot reach the database. Check that MONGODB_URI is correct and that MongoDB Atlas → Network Access allows this server (0.0.0.0/0 for serverless hosts).";
  }

  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
    return "Server is not configured: AUTH_SECRET is missing. Add it to this deployment's environment variables and redeploy.";
  }

  return null;
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
 * Return a 404 Not Found response.
 */
export function notFound(message = "Not found.") {
  return NextResponse.json<ApiResponse>(
    { ok: false, error: message },
    { status: 404 },
  );
}

/**
 * Return a 409 Conflict response.
 */
export function conflict(message: string) {
  return NextResponse.json<ApiResponse>(
    { ok: false, error: message },
    { status: 409 },
  );
}

/** True when `id` can be a MongoDB ObjectId (anything else can't match a document). */
export function isValidId(id: string | undefined): id is string {
  return Boolean(id) && isValidObjectId(id);
}

/**
 * Returned from a `withDb` callback when the target document doesn't exist,
 * because `withDb` itself returns null for "database unavailable".
 */
export const NOT_FOUND = Symbol("not-found");

/** Returned from a `withDb` callback when a project slug is already in use. */
export const SLUG_TAKEN = Symbol("slug-taken");

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
 * Lean Mongo doc → plain JSON row with a string `id` (drops `_id` and `__v`),
 * the shape every admin client component expects.
 */
export function toRow<T = Record<string, unknown>>(doc: object): T {
  const { _id, __v, ...rest } = JSON.parse(JSON.stringify(doc));
  void __v;
  return { ...rest, id: String(_id) } as T;
}

export function toRows<T = Record<string, unknown>>(docs: object[]): T[] {
  return docs.map((doc) => toRow<T>(doc));
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
