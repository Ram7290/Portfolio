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

export interface SiteSettingsInput {
  siteTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  footerText: string;
  resumeUrl?: string;
  resumeEnabled?: boolean;
  accentColor: string | null;
  seoKeywords: string[];
}

/** GET /api/settings/site — get stored site settings for editing (admin only) */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();

  const doc = await withDb(() => SiteSettingsModel.findOne().lean());
  if (!doc) return success(null);
  return success(JSON.parse(JSON.stringify(doc)));
}

/** PUT /api/settings/site — update site settings (admin only) */
export async function PUT(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const body = await parseRequestBody<SiteSettingsInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const siteTitle = body.siteTitle?.trim();
  if (!siteTitle) return badRequest("Site title is required.");

  const touchesResume = body.resumeUrl !== undefined;
  if (touchesResume && body.resumeEnabled && body.resumeUrl) {
    try {
      const parsed = new URL(body.resumeUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      return badRequest("Resume URL must be a valid http(s) URL.");
    }
  }

  const fields: Record<string, unknown> = {
    siteTitle,
    metaDescription: body.metaDescription?.trim() ?? "",
    heroHeading: body.heroHeading?.trim() ?? "",
    heroSubheading: body.heroSubheading?.trim() ?? "",
    footerText: body.footerText?.trim() ?? "",
    accentColor: body.accentColor?.trim() || null,
    seoKeywords: (body.seoKeywords ?? []).map((k: string) => k.trim()).filter(Boolean),
  };
  if (touchesResume) {
    fields.resumeUrl = body.resumeUrl?.trim() ?? "";
    fields.resumeEnabled = Boolean(body.resumeEnabled);
  }

  const result = await withDb(async () => {
    const existing = await SiteSettingsModel.findOne();
    if (existing) {
      Object.assign(existing, fields);
      await existing.save();
      return existing;
    } else {
      return await SiteSettingsModel.create(fields);
    }
  });

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/"]);
  return success();
}
