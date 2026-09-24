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

/** POST /api/services/reorder — reorder services (admin only) */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const body = await parseRequestBody<{ ids: string[] }>(request);
  if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
    return badRequest("Nothing to reorder. Provide a non-empty 'ids' array.");
  }

  const result = await withDb(async () => {
    await Promise.all(
      body.ids.map((id: string, index: number) =>
        ServiceModel.findByIdAndUpdate(id, { order: index + 1 }),
      ),
    );
  });

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/"]);
  return success();
}
