import "server-only";

import { hkdfSync } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

import { authSecret, type AdminIdentity } from "@/lib/auth";

/**
 * Bearer tokens for the mobile admin app.
 *
 * The web admin authenticates with the Auth.js session cookie, which a
 * native app can't hold reliably. Instead the app signs in through
 * POST /api/auth/token, stores the returned token, and sends it as
 * `Authorization: Bearer <token>`; requireAdmin() in api-utils accepts it.
 *
 * Tokens are stateless: they stay valid until they expire. Rotating
 * AUTH_SECRET revokes every token (and every web session) at once.
 */

const ISSUER = "portfolio";
const AUDIENCE = "portfolio-admin-app";

/** 30 days — the same lifetime as a web admin session. */
export const API_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/** Signing key derived from AUTH_SECRET, so the secret itself is never a JWT key. */
function signingKey(): Uint8Array | null {
  if (!authSecret) return null;
  return new Uint8Array(
    hkdfSync("sha256", authSecret, "portfolio-admin-app", "api bearer token", 32),
  );
}

export async function issueApiToken(
  admin: AdminIdentity,
): Promise<{ token: string; expiresAt: string } | null> {
  const key = signingKey();
  if (!key) return null;

  const expiresAt = Math.floor(Date.now() / 1000) + API_TOKEN_MAX_AGE_SECONDS;
  const token = await new SignJWT({ name: admin.name, email: admin.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(key);

  return { token, expiresAt: new Date(expiresAt * 1000).toISOString() };
}

/** Returns the admin a token was issued to, or null if it's invalid or expired. */
export async function verifyApiToken(
  token: string,
): Promise<AdminIdentity | null> {
  const key = signingKey();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
    };
  } catch {
    return null;
  }
}
