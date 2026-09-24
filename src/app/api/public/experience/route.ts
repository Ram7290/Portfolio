import { withDb } from "@/lib/mongodb";
import { ExperienceModel } from "@/models";
import { success } from "@/lib/api-utils";
import { placeholderExperience } from "@/lib/placeholder-data";

/** GET /api/public/experience - Get all experience entries */
export async function GET() {
  const docs = await withDb(() =>
    ExperienceModel.find().sort({ order: 1 }).lean(),
  );
  
  if (!docs || docs.length === 0) {
    return success(placeholderExperience);
  }
  
  return success(JSON.parse(JSON.stringify(docs)));
}
