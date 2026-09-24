import { withDb } from "@/lib/mongodb";
import { SkillModel } from "@/models";
import {
  badRequest,
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

/** GET /api/skills — list all skills (admin: all; public could filter active) */
export async function GET() {
  const docs = await withDb(() =>
    SkillModel.find().sort({ order: 1 }).lean(),
  );
  if (docs === null) return serverError("Database is not configured.");
  return success(JSON.parse(JSON.stringify(docs)));
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
      category: body.category,
      proficiency: body.proficiency?.trim() || null,
      order: Number.isFinite(body.order) ? body.order : 0,
      active: body.active,
    }),
  );

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/", "/about"]);
  return success(JSON.parse(JSON.stringify(result)), 201);
}
