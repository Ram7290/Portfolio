import { getProfile } from "@/lib/content";
import { success } from "@/lib/api-utils";

/** GET /api/public/profile — the profile (placeholder when the DB is empty) */
export async function GET() {
  return success(await getProfile());
}
