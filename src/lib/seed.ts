import bcrypt from "bcryptjs";

import { withDb, isDbConfigured } from "@/lib/mongodb";
import {
  EducationModel,
  ExperienceModel,
  ProfileModel,
  ProjectModel,
  ServiceModel,
  SiteSettingsModel,
  SkillModel,
  SocialLinkModel,
  AdminModel,
} from "@/models";
import {
  placeholderEducation,
  placeholderExperience,
  placeholderProfile,
  placeholderProjects,
  placeholderServices,
  placeholderSkills,
  placeholderSocialLinks,
} from "@/lib/placeholder-data";

/**
 * Seeds the database with placeholder content + the admin user.
 * Idempotent: skips collections that already have documents.
 *
 * Run via:  npm run seed
 */

export async function seedDatabase(): Promise<void> {
  if (!isDbConfigured()) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local first.");
  }

  await withDb(async () => {
    // Admin user from env (never committed)
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      const exists = await AdminModel.findOne({ email: adminEmail });
      if (!exists) {
        await AdminModel.create({
          email: adminEmail,
          name: "Ramduth Rajesh",
          passwordHash: await bcrypt.hash(adminPassword, 12),
        });
        console.log(`[seed] admin user created: ${adminEmail}`);
      } else {
        console.log("[seed] admin user already exists, skipping");
      }
    } else {
      console.log(
        "[seed] ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin creation",
      );
    }

    // Content collections (skip when already populated)
    if ((await ProfileModel.countDocuments()) === 0) {
      const { stats, ...rest } = placeholderProfile;
      await ProfileModel.create({ ...rest, stats: [...stats] });
      console.log("[seed] profile seeded");
    }

    if ((await SkillModel.countDocuments()) === 0) {
      await SkillModel.insertMany(
        placeholderSkills.map(({ ...s }) => s),
      );
      console.log(`[seed] ${placeholderSkills.length} skills seeded`);
    }

    if ((await ExperienceModel.countDocuments()) === 0) {
      await ExperienceModel.insertMany(
        placeholderExperience.map(({ ...e }) => e),
      );
      console.log("[seed] experience seeded");
    }

    if ((await ProjectModel.countDocuments()) === 0) {
      await ProjectModel.insertMany(
        placeholderProjects.map(({ ...p }) => p),
      );
      console.log(`[seed] ${placeholderProjects.length} projects seeded`);
    }

    if ((await ServiceModel.countDocuments()) === 0) {
      await ServiceModel.insertMany(
        placeholderServices.map(({ ...s }) => s),
      );
      console.log(`[seed] ${placeholderServices.length} services seeded`);
    }

    if ((await EducationModel.countDocuments()) === 0) {
      await EducationModel.insertMany(
        placeholderEducation.map(({ ...e }) => e),
      );
      console.log("[seed] education seeded");
    }

    if ((await SocialLinkModel.countDocuments()) === 0) {
      await SocialLinkModel.insertMany(
        placeholderSocialLinks.map(({ ...s }) => s),
      );
      console.log("[seed] social links seeded");
    }

    if ((await SiteSettingsModel.countDocuments()) === 0) {
      await SiteSettingsModel.create({
        siteTitle: "Ramduth Rajesh — Full Stack Developer",
        metaDescription: placeholderProfile.tagline,
        heroHeading: "",
        heroSubheading: "",
        footerText: "",
        resumeUrl: "",
        resumeEnabled: false,
        accentColor: null,
        seoKeywords: [],
      });
      console.log("[seed] site settings seeded");
    }
  });

  console.log("[seed] done");
}
