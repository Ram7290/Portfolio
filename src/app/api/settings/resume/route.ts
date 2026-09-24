import { withDb } from "@/lib/mongodb";
import { SiteSettingsModel } from "@/models";
import {
  badRequest,
  parseRequestBody,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  unauthorized,
} from "@/lib/api-utils";

export interface ResumeSettingsInput {
  resumeUrl: string;
  resumeEnabled: boolean;
}

/** GET /api/settings/resume — get resume settings (admin only) */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();

  const doc = await withDb(() => SiteSettingsModel.findOne().lean());
  return success({
    resumeUrl: doc?.resumeUrl ?? "",
    resumeEnabled: doc?.resumeEnabled ?? false,
  });
}

/**
 * PUT /api/settings/resume — update only the resume fields (admin only).
 * Kept separate from /api/settings/site so saving the resume never
 * overwrites the site title, SEO, or hero settings.
 */
export async function PUT(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const body = await parseRequestBody<ResumeSettingsInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const resumeUrl = body.resumeUrl?.trim() ?? "";
  const resumeEnabled = Boolean(body.resumeEnabled);
  if (resumeEnabled && resumeUrl) {
    try {
      const parsed = new URL(resumeUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      return badRequest("Resume URL must be a valid http(s) URL.");
    }
  }

  const result = await withDb(async () => {
    const existing = await SiteSettingsModel.findOne();
    if (existing) {
      Object.assign(existing, { resumeUrl, resumeEnabled });
      return await existing.save();
    }
    return await SiteSettingsModel.create({
      resumeUrl,
      resumeEnabled,
      siteTitle: "Portfolio",
    });
  });

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/", "/resume"]);
  return success();
}
