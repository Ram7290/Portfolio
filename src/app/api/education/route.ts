import { withDb } from "@/lib/mongodb";
import { EducationModel } from "@/models";
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

export interface EducationInput {
  degree: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  description: string;
  order: number;
}

/** GET /api/education — list all education entries (admin only) */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();

  const docs = await withDb(() =>
    EducationModel.find().sort({ order: 1 }).lean(),
  );
  if (docs === null) return serverError("Database is not configured.");
  return success(toRows(docs));
}

/** POST /api/education — create education entry (admin only) */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const body = await parseRequestBody<EducationInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const degree = body.degree?.trim();
  const institution = body.institution?.trim();
  if (!degree) return badRequest("Degree is required.");
  if (!institution) return badRequest("Institution is required.");

  const year = Number(body.startYear);
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return badRequest("Start year must be a valid year.");
  }
  if (body.endYear != null) {
    const endYear = Number(body.endYear);
    if (!Number.isInteger(endYear) || endYear < year || endYear > 2100) {
      return badRequest("End year must be a valid year on/after the start year.");
    }
  }

  const result = await withDb(() =>
    EducationModel.create({
      degree,
      institution,
      startYear: year,
      endYear: body.endYear != null ? Number(body.endYear) : null,
      description: body.description?.trim() || null,
      order: Number.isFinite(body.order) ? body.order : 0,
    }),
  );

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/", "/about"]);
  return success(JSON.parse(JSON.stringify(result)), 201);
}
