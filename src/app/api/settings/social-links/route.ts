import { withDb } from "@/lib/mongodb";
import { SocialLinkModel } from "@/models";
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

export interface SocialLinkInput {
  platform: string;
  url: string;
  order: number;
  active: boolean;
}

/** GET /api/settings/social-links — list all social links, including hidden ones (admin only) */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();

  const docs = await withDb(() =>
    SocialLinkModel.find().sort({ order: 1 }).lean(),
  );
  if (docs === null) return serverError("Database is not configured.");
  return success(toRows(docs));
}

/** POST /api/settings/social-links — create a social link (admin only) */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const body = await parseRequestBody<SocialLinkInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const platform = body.platform?.trim();
  const url = body.url?.trim();
  if (!platform) return badRequest("Platform name is required.");
  if (!url) return badRequest("URL is required.");

  const result = await withDb(() =>
    SocialLinkModel.create({
      platform,
      url,
      order: Number.isFinite(body.order) ? body.order : 0,
      active: body.active,
    }),
  );

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/"]);
  return success(JSON.parse(JSON.stringify(result)), 201);
}
