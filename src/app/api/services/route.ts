import { withDb } from "@/lib/mongodb";
import { ServiceModel } from "@/models";
import {
  badRequest,
  parseRequestBody,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  unauthorized,
} from "@/lib/api-utils";

export interface ServiceInput {
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

/** GET /api/services — list all services */
export async function GET() {
  const docs = await withDb(() =>
    ServiceModel.find().sort({ order: 1 }).lean(),
  );
  if (docs === null) return serverError("Database is not configured.");
  return success(JSON.parse(JSON.stringify(docs)));
}

/** POST /api/services — create a service (admin only) */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const body = await parseRequestBody<ServiceInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const title = body.title?.trim();
  if (!title) return badRequest("Service title is required.");

  const result = await withDb(() =>
    ServiceModel.create({
      title,
      description: body.description?.trim() ?? "",
      icon: body.icon?.trim() || "sparkles",
      order: Number.isFinite(body.order) ? body.order : 0,
      active: body.active,
    }),
  );

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/"]);
  return success(JSON.parse(JSON.stringify(result)), 201);
}
