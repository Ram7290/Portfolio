import { getExperience } from "@/lib/content";
import { success } from "@/lib/api-utils";

/** GET /api/public/experience — work history, in display order */
export async function GET() {
  return success(await getExperience());
}
