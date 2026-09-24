import { withDb } from "@/lib/mongodb";
import { ProjectModel } from "@/models";
import { serverError, success } from "@/lib/api-utils";

/** GET /api/public/projects - Get all published projects */
export async function GET() {
  const docs = await withDb(() =>
    ProjectModel.find().sort({ order: 1 }).lean(),
  );
  
  if (docs === null) {
    // Return empty array if DB not configured instead of error
    return success([]);
  }
  
  return success(JSON.parse(JSON.stringify(docs)));
}
