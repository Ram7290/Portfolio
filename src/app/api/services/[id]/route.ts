import { withDb } from "@/lib/mongodb";
import { ServiceModel } from "@/models";
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

export interface ServiceInput {
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

/** PUT /api/services/[id] — update a service (admin only) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  const body = await parseRequestBody<ServiceInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const title = body.title?.trim();
  if (!title) return badRequest("Service title is required.");

  const result = await withDb(async () =>
    (await ServiceModel.findByIdAndUpdate(id, {
      title,
      description: body.description?.trim() ?? "",
      icon: body.icon?.trim() || "sparkles",
      order: Number.isFinite(body.order) ? body.order : 0,
      active: body.active,
    })) ?? NOT_FOUND,
  );

  if (result === null) return serverError("Database is not configured.");
  if (result === NOT_FOUND) return notFound();

  revalidatePaths(["/"]);
  return success();
}

/** DELETE /api/services/[id] — delete a service (admin only) */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  const result = await withDb(async () => (await ServiceModel.findByIdAndDelete(id)) ?? NOT_FOUND);
  if (result === null) return serverError("Database is not configured.");
  if (result === NOT_FOUND) return notFound();

  revalidatePaths(["/"]);
  return success();
}
