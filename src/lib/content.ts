import "server-only";

import {
  placeholderEducation,
  placeholderExperience,
  placeholderProfile,
  placeholderProjects,
  placeholderServices,
  placeholderSkills,
  placeholderSocialLinks,
} from "@/lib/placeholder-data";
import { withDb } from "@/lib/mongodb";
import { siteConfig as fallbackSiteConfig, type SiteConfig } from "@/lib/data";
import {
  EducationModel,
  ExperienceModel,
  ProfileModel,
  ProjectModel,
  ServiceModel,
  SiteSettingsModel,
  SkillModel,
  SocialLinkModel,
} from "@/models";

import type {
  Education,
  Experience,
  Profile,
  Project,
  Service,
  Skill,
  SocialLinkItem,
} from "@/types/portfolio";

/**
 * Content service: reads from MongoDB when configured, otherwise falls
 * back to placeholder data so the site works before Phase 3 setup.
 */

const plain = <T>(doc: T): T => JSON.parse(JSON.stringify(doc));

/** "Ramduth Rajesh" → "RR" */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  return (parts[0][0] + (last[0] ?? "")).toUpperCase();
}

/**
 * Site-wide identity (header, footer, metadata) assembled from the database:
 * Profile for the person, SocialLink for the links, SiteSettings for resume
 * and footer text. Each field falls back to `siteConfig` when missing.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  const [profile, links, settings] = await Promise.all([
    withDb(() => ProfileModel.findOne().sort({ updatedAt: -1 }).lean()),
    withDb(() => SocialLinkModel.find({ active: true }).sort({ order: 1 }).lean()),
    withDb(() => SiteSettingsModel.findOne().lean()),
  ]);

  const urlFor = (platform: string) =>
    links?.find((l) => l.platform.toLowerCase() === platform)?.url;

  const name = profile?.name || fallbackSiteConfig.name;

  return {
    ...fallbackSiteConfig,
    name,
    initials: initialsOf(name) || fallbackSiteConfig.initials,
    role: profile?.role || fallbackSiteConfig.role,
    tagline: profile?.tagline || fallbackSiteConfig.tagline,
    email: profile?.email || fallbackSiteConfig.email,
    location: profile?.location || fallbackSiteConfig.location,
    availability: profile
      ? { open: profile.available, label: profile.availabilityLabel }
      : fallbackSiteConfig.availability,
    // Only surface the résumé link once the admin has enabled it; otherwise
    // consumers fall back to the /resume page.
    resumeUrl:
      settings?.resumeEnabled && settings.resumeUrl
        ? settings.resumeUrl
        : fallbackSiteConfig.resumeUrl,
    footerText: settings?.footerText || fallbackSiteConfig.footerText,
    social: {
      github: urlFor("github") || fallbackSiteConfig.social.github,
      linkedin: urlFor("linkedin") || fallbackSiteConfig.social.linkedin,
    },
    // `url` stays env-driven (NEXT_PUBLIC_SITE_URL) — it isn't admin content.
  };
}

export async function getProfile(): Promise<Profile> {
  const doc = await withDb(async () =>
    ProfileModel.findOne().sort({ updatedAt: -1 }).lean(),
  );
  return doc ? plain(doc) : placeholderProfile;
}

export async function getSkills(): Promise<Skill[]> {
  const docs = await withDb(() =>
    SkillModel.find({ active: true }).sort({ order: 1 }).lean(),
  );
  return docs?.length ? plain(docs) : placeholderSkills.filter((s) => s.active);
}

export async function getExperience(): Promise<Experience[]> {
  const docs = await withDb(() =>
    ExperienceModel.find().sort({ order: 1 }).lean(),
  );
  return docs?.length ? plain(docs) : placeholderExperience;
}

export async function getProjects(): Promise<Project[]> {
  const docs = await withDb(() => ProjectModel.find().sort({ order: 1 }).lean());
  return docs?.length ? plain(docs) : placeholderProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const doc = await withDb(() => ProjectModel.findOne({ slug }).lean());
  if (doc) return plain(doc);
  return placeholderProjects.find((p) => p.slug === slug) ?? null;
}

export async function getServices(): Promise<Service[]> {
  const docs = await withDb(() =>
    ServiceModel.find({ active: true }).sort({ order: 1 }).lean(),
  );
  return docs?.length ? plain(docs) : placeholderServices.filter((s) => s.active);
}

export async function getEducation(): Promise<Education[]> {
  const docs = await withDb(() =>
    EducationModel.find().sort({ order: 1 }).lean(),
  );
  return docs?.length ? plain(docs) : placeholderEducation;
}

export async function getSocialLinks(): Promise<SocialLinkItem[]> {
  const docs = await withDb(() =>
    SocialLinkModel.find({ active: true }).sort({ order: 1 }).lean(),
  );
  return docs?.length ? plain(docs) : placeholderSocialLinks.filter((s) => s.active);
}
