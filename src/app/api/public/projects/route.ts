import { getProjects } from "@/lib/content";
import { success } from "@/lib/api-utils";

/** GET /api/public/projects — all projects, in display order */
export async function GET() {
  return success(await getProjects());
}
