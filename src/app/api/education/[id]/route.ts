import { withDb } from "@/lib/mongodb";
import { EducationModel } from "@/models";
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

export interface EducationInput {
  degree: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  description: string;
  order: number;
}

/** PUT /api/education/[id] — update education entry (admin only) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

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

  const result = await withDb(async () =>
    (await EducationModel.findByIdAndUpdate(id, {
      degree,
      institution,
      startYear: year,
      endYear: body.endYear != null ? Number(body.endYear) : null,
      description: body.description?.trim() || null,
      order: Number.isFinite(body.order) ? body.order : 0,
    })) ?? NOT_FOUND,
  );

  if (result === null) return serverError("Database is not configured.");
  if (result === NOT_FOUND) return notFound();

  revalidatePaths(["/", "/about"]);
  return success();
}

/** DELETE /api/education/[id] — delete education entry (admin only) */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  const result = await withDb(async () => (await EducationModel.findByIdAndDelete(id)) ?? NOT_FOUND);
  if (result === null) return serverError("Database is not configured.");
  if (result === NOT_FOUND) return notFound();

  revalidatePaths(["/", "/about"]);
  return success();
}
