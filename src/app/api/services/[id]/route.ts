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

/** PUT /api/services/[id] — update a service (admin only) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!id) return badRequest("Missing id.");

  const body = await parseRequestBody<ServiceInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const title = body.title?.trim();
  if (!title) return badRequest("Service title is required.");

  const result = await withDb(() =>
    ServiceModel.findByIdAndUpdate(id, {
      title,
      description: body.description?.trim() ?? "",
      icon: body.icon?.trim() || "sparkles",
      order: Number.isFinite(body.order) ? body.order : 0,
      active: body.active,
    }),
  );

  if (result === null) return serverError("Database is not configured.");

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
  if (!id) return badRequest("Missing id.");

  const result = await withDb(() => ServiceModel.findByIdAndDelete(id));
  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/"]);
  return success();
}
