import { withDb } from "@/lib/mongodb";
import { ProfileModel } from "@/models";
import {
  badRequest,
  parseRequestBody,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  toRow,
  unauthorized,
} from "@/lib/api-utils";
import type { StatItem } from "@/types/portfolio";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ProfileInput {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  available: boolean;
  availabilityLabel: string;
  imageUrl: string | null;
  stats: StatItem[];
}

/** GET /api/profile — fetch the stored profile for editing (admin only) */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();

  const doc = await withDb(() =>
    ProfileModel.findOne().sort({ updatedAt: -1 }).lean(),
  );
  if (!doc) return success(null);
  return success(toRow(doc));
}

/** PUT /api/profile — create or update the profile (admin only) */
export async function PUT(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const body = await parseRequestBody<ProfileInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const name = body.name?.trim();
  const role = body.role?.trim();
  const tagline = body.tagline?.trim();

  if (!name) return badRequest("Name is required.");
  if (!role) return badRequest("Role/title is required.");
  if (!tagline) return badRequest("Tagline is required.");
  if (body.email && !EMAIL_RE.test(body.email)) {
    return badRequest("Enter a valid email address.");
  }

  const bio = body.bio
    .split(/\n{2,}/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  const result = await withDb(async () => {
    const existing = await ProfileModel.findOne();
    const fields = {
      name,
      role,
      tagline,
      bio,
      location: body.location?.trim() ?? "",
      email: body.email?.trim() ?? "",
      available: body.available,
      availabilityLabel: body.availabilityLabel?.trim() || "Open to Opportunities",
      imageUrl: body.imageUrl,
      stats: (body.stats ?? []).filter(
        (s: StatItem) => s.value?.trim() && s.label?.trim(),
      ),
    };
    if (existing) {
      Object.assign(existing, fields);
      await existing.save();
      return existing;
    } else {
      return await ProfileModel.create(fields);
    }
  });

  if (result === null) return serverError("Database is not configured.");

  revalidatePaths(["/"]);
  return success();
}
