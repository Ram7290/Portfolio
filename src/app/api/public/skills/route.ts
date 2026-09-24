import { getSkills } from "@/lib/content";
import { success } from "@/lib/api-utils";

/** GET /api/public/skills — active skills, in display order */
export async function GET() {
  return success(await getSkills());
}
