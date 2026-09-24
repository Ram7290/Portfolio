import { withDb } from "@/lib/mongodb";
import { ProfileModel } from "@/models";
import { success } from "@/lib/api-utils";
import { placeholderProfile } from "@/lib/placeholder-data";

/** GET /api/public/profile - Get the profile */
export async function GET() {
  const doc = await withDb(() =>
    ProfileModel.findOne().sort({ updatedAt: -1 }).lean(),
  );
  
  // Return placeholder if no profile exists
  if (!doc) return success(placeholderProfile);
  
  return success(JSON.parse(JSON.stringify(doc)));
}
