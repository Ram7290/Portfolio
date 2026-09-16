"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { withDb } from "@/lib/mongodb";
import { SiteSettingsModel, SocialLinkModel } from "@/models";

import type { ActionResult } from "./profile";

export type { ActionResult };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/* ------------------------------------------------------------------ */
/* Social links                                                        */
/* ------------------------------------------------------------------ */

export interface SocialLinkInput {
  id?: string;
  platform: string;
  url: string;
  order: number;
  active: boolean;
}

export async function saveSocialLink(
  input: SocialLinkInput,
): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");

  const platform = input.platform?.trim();
  const url = input.url?.trim();
  if (!platform) return fail("Platform name is required.");
  if (!url) return fail("URL is required.");

  const fields = {
    platform,
    url,
    order: Number.isFinite(input.order) ? input.order : 0,
    active: input.active,
  };

  const result = await withDb(async () => {
    if (input.id) {
      await SocialLinkModel.findByIdAndUpdate(input.id, fields);
    } else {
      await SocialLinkModel.create(fields);
    }
  });
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!id) return fail("Missing id.");

  const result = await withDb(() => SocialLinkModel.findByIdAndDelete(id));
  if (result === null) return fail("Database is not configured.");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function reorderSocialLinks(ids: string[]): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!Array.isArray(ids) || ids.length === 0) return fail("Nothing to reorder.");
  const result = await withDb(async () => {
    await Promise.all(
      ids.map((id, index) =>
        SocialLinkModel.findByIdAndUpdate(id, { order: index + 1 }),
      ),
    );
  });
  if (result === null) return fail("Database is not configured.");
  revalidatePath("/", "layout");
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Resume settings                                                     */
/* ------------------------------------------------------------------ */

export async function saveResumeSettings(
  input: { resumeUrl: string; resumeEnabled: boolean },
): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");

  const resumeUrl = input.resumeUrl?.trim() ?? "";
  if (input.resumeEnabled && resumeUrl) {
    try {
      const parsed = new URL(resumeUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      return fail("Resume URL must be a valid http(s) URL.");
    }
  }

  const result = await withDb(async () => {
    const existing = await SiteSettingsModel.findOne();
    const fields = { resumeUrl, resumeEnabled: input.resumeEnabled };
    if (existing) {
      Object.assign(existing, fields);
      await existing.save();
    } else {
      await SiteSettingsModel.create({ ...fields, siteTitle: "Portfolio" });
    }
  });
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/", "layout");
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

export interface SiteSettingsInput {
  siteTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  footerText: string;
  /** Optional — when omitted, existing resume settings are preserved. */
  resumeUrl?: string;
  resumeEnabled?: boolean;
  accentColor: string | null;
  seoKeywords: string[];
}

export async function saveSiteSettings(
  input: SiteSettingsInput,
): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");

  const siteTitle = input.siteTitle?.trim();
  if (!siteTitle) return fail("Site title is required.");

  const touchesResume = input.resumeUrl !== undefined;
  if (touchesResume && input.resumeEnabled && input.resumeUrl) {
    try {
      const parsed = new URL(input.resumeUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      return fail("Resume URL must be a valid http(s) URL.");
    }
  }

  const fields: Record<string, unknown> = {
    siteTitle,
    metaDescription: input.metaDescription?.trim() ?? "",
    heroHeading: input.heroHeading?.trim() ?? "",
    heroSubheading: input.heroSubheading?.trim() ?? "",
    footerText: input.footerText?.trim() ?? "",
    accentColor: input.accentColor?.trim() || null,
    seoKeywords: input.seoKeywords.map((k) => k.trim()).filter(Boolean),
  };
  if (touchesResume) {
    fields.resumeUrl = input.resumeUrl?.trim() ?? "";
    fields.resumeEnabled = Boolean(input.resumeEnabled);
  }

  const result = await withDb(async () => {
    const existing = await SiteSettingsModel.findOne();
    if (existing) {
      Object.assign(existing, fields);
      await existing.save();
    } else {
      await SiteSettingsModel.create(fields);
    }
  });
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/", "layout");
  return { ok: true };
}
