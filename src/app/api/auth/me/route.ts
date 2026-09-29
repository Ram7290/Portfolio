import { getAdmin, success, unauthorized } from "@/lib/api-utils";

/**
 * GET /api/auth/me — the signed-in admin (app token or web session).
 * The mobile app calls this on launch to check its stored token is still valid.
 */
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  return success(admin);
}
