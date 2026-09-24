import { withDb } from "@/lib/mongodb";
import { ExperienceModel } from "@/models";
import {
  badRequest,
  parseRequestBody,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  unauthorized,
} from "@/lib/api-utils";

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export interface ExperienceInput {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  order: number;
}

/** GET /api/experience — list all experience */
export async function GET() {
  const docs = await withDb(() =>
    ExperienceModel.find().sort({ order: 1 }).lean(),
  );
  if (docs === null) return serverError("Database is not configured.");
  return success(JSON.parse(JSON.stringify(docs)));
}

/** POST /api/experience — create experience entry (admin only) */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const body = await parseRequestBody<ExperienceInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const company = body.company?.trim();
  const role = body.role?.trim();
  if (!company) return badRequest("Company is required.");
  if (!role) return badRequest("Job title is required.");
  if (!MONTH_RE.test(body.startDate ?? "")) {
    return badRequest("Start date must be in YYYY-MM format.");
  }
  if (!body.current && body.endDate && !MONTH_RE.test(body.endDate)) {
    return badRequest("End date must be in YYYY-MM format.");
  }
  if (!body.current && body.endDate && body.endDate < body.startDate) {
    return badRequest("End date cannot be before start date.");
  }

  const result = await withDb(() =>
    ExperienceModel.create({
      company,
      role,
      location: body.location?.trim() || null,
      startDate: body.startDate,
      endDate: body.current ? null : body.endDate || null,
      current: body.current,
      description: body.description?.trim() ?? "",
      responsibilities: (body.responsibilities ?? []).filter(Boolean),
      technologies: (body.technologies ?? []).filter(Boolean),
      achievements: (body.achievements ?? []).filter(Boolean),
      order: Number.isFinite(body.order) ? body.order : 0,
    }),
  );

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/", "/about"]);
  return success(JSON.parse(JSON.stringify(result)), 201);
}
