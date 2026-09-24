import { withDb } from "@/lib/mongodb";
import { SkillModel } from "@/models";
import { success } from "@/lib/api-utils";
import { placeholderSkills } from "@/lib/placeholder-data";

/** GET /api/public/skills - Get all active skills */
export async function GET() {
  const docs = await withDb(() =>
    SkillModel.find({ active: true }).sort({ order: 1 }).lean(),
  );
  
  if (!docs || docs.length === 0) {
    return success(placeholderSkills.filter((s) => s.active));
  }
  
  return success(JSON.parse(JSON.stringify(docs)));
}
