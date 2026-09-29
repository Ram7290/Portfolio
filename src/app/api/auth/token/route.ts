import { verifyAdminCredentials, type AdminIdentity } from "@/lib/auth";
import { issueApiToken } from "@/lib/api-token";
import {
  badRequest,
  loginConfigError,
  parseRequestBody,
  serverError,
  success,
  unauthorized,
} from "@/lib/api-utils";

export interface TokenResponse {
  token: string;
  expiresAt: string;
  admin: AdminIdentity;
}

/**
 * POST /api/auth/token — sign in from the mobile app.
 * Returns a bearer token to send as `Authorization: Bearer <token>`.
 * Signing out is client-side: the app deletes its stored token.
 */
export async function POST(request: Request) {
  const body = await parseRequestBody<{ email?: unknown; password?: unknown }>(
    request,
  );
  if (!body) return badRequest("Invalid request body.");

  if (!String(body.email ?? "").trim() || !body.password) {
    return badRequest("Email and password are required.");
  }

  const configError = await loginConfigError();
  if (configError) return serverError(configError);

  const admin = await verifyAdminCredentials(body.email, body.password);
  if (!admin) return unauthorized("Invalid email or password.");

  const issued = await issueApiToken(admin);
  if (!issued) {
    return serverError(
      "Server is not configured: AUTH_SECRET is missing. Add it to this deployment's environment variables and redeploy.",
    );
  }

  return success<TokenResponse>({ ...issued, admin });
}
