import { getSiteConfig } from "@/lib/content";
import { success } from "@/lib/api-utils";

/** GET /api/public/site-config — site identity for header, footer and metadata */
export async function GET() {
  return success(await getSiteConfig());
}
