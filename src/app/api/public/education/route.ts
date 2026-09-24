import { getEducation } from "@/lib/content";
import { success } from "@/lib/api-utils";

/** GET /api/public/education — education entries, in display order */
export async function GET() {
  return success(await getEducation());
}
