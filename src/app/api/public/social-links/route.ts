import { withDb } from "@/lib/mongodb";
import { SocialLinkModel } from "@/models";
import { success } from "@/lib/api-utils";
import { placeholderSocialLinks } from "@/lib/placeholder-data";

/** GET /api/public/social-links - Get active social links */
export async function GET() {
  const docs = await withDb(() =>
    SocialLinkModel.find({ active: true }).sort({ order: 1 }).lean(),
  );
  
  // Return placeholder if no social links exist
  if (!docs || docs.length === 0) {
    return success(placeholderSocialLinks.filter((s) => s.active));
  }
  
  return success(JSON.parse(JSON.stringify(docs)));
}