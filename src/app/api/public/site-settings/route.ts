import { getSiteSettings } from "@/lib/settings";
import { success } from "@/lib/api-utils";

/** GET /api/public/site-settings — SEO metadata and hero overrides */
export async function GET() {
  return success(await getSiteSettings());
}
