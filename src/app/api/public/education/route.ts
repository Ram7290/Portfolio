import { withDb } from "@/lib/mongodb";
import { EducationModel } from "@/models";
import { success } from "@/lib/api-utils";
import { placeholderEducation } from "@/lib/placeholder-data";

/** GET /api/public/education - Get all education entries */
export async function GET() {
  const docs = await withDb(() =>
    EducationModel.find().sort({ order: 1 }).lean(),
  );
  
  if (!docs || docs.length === 0) {
    return success(placeholderEducation);
  }
  
  return success(JSON.parse(JSON.stringify(docs)));
}
