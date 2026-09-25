import { withDb } from "@/lib/mongodb";
import { ContactMessageModel } from "@/models";
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

/** PATCH /api/messages/[id] — mark message as read/unread (admin only) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  const body = await parseRequestBody<{ read: boolean }>(request);
  if (!body || typeof body.read !== "boolean") {
    return badRequest("Missing or invalid 'read' field.");
  }

  const result = await withDb(async () =>
    (await ContactMessageModel.findByIdAndUpdate(id, { read: body.read })) ?? NOT_FOUND,
  );

  if (result === null) return serverError("Database is not configured.");
  if (result === NOT_FOUND) return notFound();

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
  if (!isValidId(id)) return notFound();

  const result = await withDb(async () => (await ContactMessageModel.findByIdAndDelete(id)) ?? NOT_FOUND);
  if (result === null) return serverError("Database is not configured.");
  if (result === NOT_FOUND) return notFound();

  revalidatePaths(["/admin/messages", "/admin"]);
  return success();
}
