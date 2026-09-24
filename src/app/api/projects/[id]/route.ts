import { withDb } from "@/lib/mongodb";
import { ProjectModel } from "@/models";
import {
  badRequest,
  parseRequestBody,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  unauthorized,
} from "@/lib/api-utils";

const CATEGORIES = ["Full Stack", "Frontend", "Backend", "Other"] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface ProjectInput {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  challenges: string;
  results: string;
  technologies: string[];
  category: string;
  thumbnailUrl: string | null;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
}

/** PUT /api/projects/[id] — update a project (admin only) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!id) return badRequest("Missing id.");

  const body = await parseRequestBody<ProjectInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const title = body.title?.trim();
  const shortDescription = body.shortDescription?.trim();
  if (!title) return badRequest("Project title is required.");
  if (!shortDescription) return badRequest("Short description is required.");
  if (!CATEGORIES.includes(body.category as (typeof CATEGORIES)[number])) {
    return badRequest("Invalid category.");
  }

  const slug = slugify(body.slug || title);
  if (!slug) return badRequest("Could not derive a slug. Provide one explicitly.");

  const result = await withDb(async () => {
    // Check slug uniqueness (excluding this project)
    const clash = await ProjectModel.findOne({ slug, _id: { $ne: id } });
    if (clash) throw new Error("SLUG_TAKEN");

    return await ProjectModel.findByIdAndUpdate(id, {
      title,
      slug,
      shortDescription,
      description: body.description?.trim() ?? "",
      problem: body.problem?.trim() || null,
      solution: body.solution?.trim() || null,
      features: (body.features ?? []).filter(Boolean),
      challenges: body.challenges?.trim() || null,
      results: body.results?.trim() || null,
      technologies: (body.technologies ?? []).filter(Boolean),
      category: body.category,
      thumbnailUrl: body.thumbnailUrl,
      githubUrl: body.githubUrl?.trim() || null,
      liveUrl: body.liveUrl?.trim() || null,
      featured: body.featured,
      order: Number.isFinite(body.order) ? body.order : 0,
    });
  });

  if (result === null) {
    return serverError("Database is not configured.");
  }

  revalidatePaths(["/", "/projects", `/projects/${slug}`]);
  return success();
}

/** DELETE /api/projects/[id] — delete a project (admin only) */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!id) return badRequest("Missing id.");

  const result = await withDb(() => ProjectModel.findByIdAndDelete(id));
  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/", "/projects"]);
  return success();
}
