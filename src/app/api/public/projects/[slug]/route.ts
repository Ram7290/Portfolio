import { withDb } from "@/lib/mongodb";
import { ProjectModel } from "@/models";
import { badRequest, success } from "@/lib/api-utils";

/** GET /api/public/projects/[slug] - Get single project by slug */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  
  if (!slug) return badRequest("Missing slug.");

  const doc = await withDb(() => ProjectModel.findOne({ slug }).lean());
  
  if (!doc) {
    return new Response(JSON.stringify({ ok: false, error: "Project not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  return success(JSON.parse(JSON.stringify(doc)));
}
