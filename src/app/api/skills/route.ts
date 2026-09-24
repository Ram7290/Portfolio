import { withDb } from "@/lib/mongodb";
import { SkillModel } from "@/models";
import {
  badRequest,
  parseRequestBody,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  toRows,
  unauthorized,
} from "@/lib/api-utils";
import type { SkillCategory } from "@/types/portfolio";

const CATEGORIES = ["Frontend", "Backend", "Databases", "Tools"] as const;

export interface SkillInput {
  name: string;
  category: string;
  proficiency: string;
  order: number;
  active: boolean;
}

/** GET /api/skills — list all skills, including inactive ones (admin only) */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();

  const docs = await withDb(() =>
    SkillModel.find().sort({ order: 1 }).lean(),
  );
  if (docs === null) return serverError("Database is not configured.");
  return success(toRows(docs));
}

/** POST /api/skills — create a skill (admin only) */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const body = await parseRequestBody<SkillInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const name = body.name?.trim();
  if (!name) return badRequest("Skill name is required.");
  if (!CATEGORIES.includes(body.category as (typeof CATEGORIES)[number])) {
    return badRequest("Invalid category. Must be one of: Frontend, Backend, Databases, Tools.");
  }

  const result = await withDb(() =>
    SkillModel.create({
      name,
      category: body.category as SkillCategory,
      proficiency: body.proficiency?.trim() || null,
      order: Number.isFinite(body.order) ? body.order : 0,
      active: body.active,
    }),
  );

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/", "/about"]);
  return success(JSON.parse(JSON.stringify(result)), 201);
}
