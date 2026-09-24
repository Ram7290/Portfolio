import { getSocialLinks } from "@/lib/content";
import { success } from "@/lib/api-utils";

/** GET /api/public/social-links — active social links, in display order */
export async function GET() {
  return success(await getSocialLinks());
}
