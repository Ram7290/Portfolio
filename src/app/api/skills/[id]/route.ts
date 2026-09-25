import { withDb } from "@/lib/mongodb";
import { SkillModel } from "@/models";
import {
  NOT_FOUND,
  badRequest,
  isValidId,
  notFound,
  parseRequestBody,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  unauthorized,
} from "@/lib/api-utils";

const CATEGORIES = ["Frontend", "Backend", "Databases", "Tools"] as const;

export interface SkillInput {
  name: string;
  category: string;
  proficiency: string;
  order: number;
  active: boolean;
}

/** PUT /api/skills/[id] — update a skill (admin only) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  const body = await parseRequestBody<SkillInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const name = body.name?.trim();
  if (!name) return badRequest("Skill name is required.");
  if (!CATEGORIES.includes(body.category as (typeof CATEGORIES)[number])) {
    return badRequest("Invalid category.");
  }

  const result = await withDb(async () =>
    (await SkillModel.findByIdAndUpdate(id, {
      name,
      category: body.category,
      proficiency: body.proficiency?.trim() || null,
      order: Number.isFinite(body.order) ? body.order : 0,
      active: body.active,
    })) ?? NOT_FOUND,
  );

  if (result === null) return serverError("Database is not configured.");
  if (result === NOT_FOUND) return notFound();

  revalidatePaths(["/", "/about"]);
  return success();
}

/** DELETE /api/skills/[id] — delete a skill (admin only) */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  const result = await withDb(async () => (await SkillModel.findByIdAndDelete(id)) ?? NOT_FOUND);
  if (result === null) return serverError("Database is not configured.");
  if (result === NOT_FOUND) return notFound();

  revalidatePaths(["/", "/about"]);
  return success();
}

/** PATCH /api/skills/[id] — toggle active state (admin only) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  const body = await parseRequestBody<{ active: boolean }>(request);
  if (!body || typeof body.active !== "boolean") {
    return badRequest("Missing or invalid 'active' field.");
  }

  const result = await withDb(async () =>
    (await SkillModel.findByIdAndUpdate(id, { active: body.active })) ?? NOT_FOUND,
  );

  if (result === null) return serverError("Database is not configured.");
  if (result === NOT_FOUND) return notFound();

  revalidatePaths(["/", "/about"]);
  return success();
}
