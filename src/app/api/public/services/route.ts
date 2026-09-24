import { withDb } from "@/lib/mongodb";
import { ServiceModel } from "@/models";
import { success } from "@/lib/api-utils";
import { placeholderServices } from "@/lib/placeholder-data";

/** GET /api/public/services - Get all active services */
export async function GET() {
  const docs = await withDb(() =>
    ServiceModel.find({ active: true }).sort({ order: 1 }).lean(),
  );
  
  if (!docs || docs.length === 0) {
    return success(placeholderServices.filter((s) => s.active));
  }
  
  return success(JSON.parse(JSON.stringify(docs)));
}
