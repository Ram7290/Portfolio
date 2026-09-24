import { withDb } from "@/lib/mongodb";
import { ContactMessageModel } from "@/models";
import {
  badRequest,
  parseRequestBody,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  unauthorized,
} from "@/lib/api-utils";

/** PATCH /api/messages/[id] — mark message as read/unread (admin only) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!id) return badRequest("Missing id.");

  const body = await parseRequestBody<{ read: boolean }>(request);
  if (!body || typeof body.read !== "boolean") {
    return badRequest("Missing or invalid 'read' field.");
  }

  const result = await withDb(() =>
    ContactMessageModel.findByIdAndUpdate(id, { read: body.read }),
  );

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/admin/messages", "/admin"]);
  return success();
}

/** DELETE /api/messages/[id] — delete message (admin only) */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!id) return badRequest("Missing id.");

  const result = await withDb(() => ContactMessageModel.findByIdAndDelete(id));
  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/admin/messages", "/admin"]);
  return success();
}
