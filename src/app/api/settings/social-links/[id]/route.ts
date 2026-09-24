import { withDb } from "@/lib/mongodb";
import { SocialLinkModel } from "@/models";
import {
  badRequest,
  parseRequestBody,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  unauthorized,
} from "@/lib/api-utils";

export interface SocialLinkInput {
  platform: string;
  url: string;
  order: number;
  active: boolean;
}

/** PUT /api/settings/social-links/[id] — update a social link (admin only) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!id) return badRequest("Missing id.");

  const body = await parseRequestBody<SocialLinkInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const platform = body.platform?.trim();
  const url = body.url?.trim();
  if (!platform) return badRequest("Platform name is required.");
  if (!url) return badRequest("URL is required.");

  const result = await withDb(() =>
    SocialLinkModel.findByIdAndUpdate(id, {
      platform,
      url,
      order: Number.isFinite(body.order) ? body.order : 0,
      active: body.active,
    }),
  );

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/"]);
  return success();
}

/** DELETE /api/settings/social-links/[id] — delete a social link (admin only) */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorized();

  const { id } = await params;
  if (!id) return badRequest("Missing id.");

  const result = await withDb(() => SocialLinkModel.findByIdAndDelete(id));
  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/"]);
  return success();
}
