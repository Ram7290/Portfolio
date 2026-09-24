import { getServices } from "@/lib/content";
import { success } from "@/lib/api-utils";

/** GET /api/public/services — active services, in display order */
export async function GET() {
  return success(await getServices());
}
