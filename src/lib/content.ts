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
import {
  EducationModel,
  ExperienceModel,
  ProfileModel,
  ProjectModel,
  ServiceModel,
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
