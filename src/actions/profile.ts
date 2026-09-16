"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { withDb } from "@/lib/mongodb";
import { ProfileModel } from "@/models";
import type { StatItem } from "@/types/portfolio";

/**
 * Server actions for the admin panel. Every mutation:
 * 1. checks the session server-side (never trusts the client),
 * 2. validates input (custom validation — no zod),
 * 3. revalidates affected public paths.
 */

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

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

export async function saveProfile(input: ProfileInput): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");

  const name = input.name?.trim();
  const role = input.role?.trim();
  const tagline = input.tagline?.trim();

  if (!name) return fail("Name is required.");
  if (!role) return fail("Role/title is required.");
  if (!tagline) return fail("Tagline is required.");
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return fail("Enter a valid email address.");
  }

  const bio = input.bio
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const result = await withDb(async () => {
    const existing = await ProfileModel.findOne();
    const fields = {
      name,
      role,
      tagline,
      bio,
      location: input.location?.trim() ?? "",
      email: input.email?.trim() ?? "",
      available: input.available,
      availabilityLabel: input.availabilityLabel?.trim() || "Open to Opportunities",
      imageUrl: input.imageUrl,
      stats: input.stats.filter((s) => s.value?.trim() && s.label?.trim()),
    };
    if (existing) {
      Object.assign(existing, fields);
      await existing.save();
    } else {
      await ProfileModel.create(fields);
    }
  });

  if (result === null) return fail("Database is not configured.");

  revalidatePath("/", "layout");
  return { ok: true };
}
