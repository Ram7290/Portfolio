import "server-only";

import { withDb } from "@/lib/mongodb";
import { SiteSettingsModel } from "@/models";
import { placeholderProfile } from "@/lib/placeholder-data";

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  footerText: string;
  resumeUrl: string;
  resumeEnabled: boolean;
  seoKeywords: string[];
}

const DEFAULTS: SiteSettings = {
  siteTitle: "Ramduth Rajesh — Full Stack Developer",
  metaDescription: placeholderProfile.tagline,
  heroHeading: "",
  heroSubheading: "",
  footerText: "",
  resumeUrl: "",
  resumeEnabled: false,
  seoKeywords: [],
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await withDb(() => SiteSettingsModel.findOne().lean());
  if (!doc) return DEFAULTS;
  return {
    siteTitle: doc.siteTitle || DEFAULTS.siteTitle,
    metaDescription: doc.metaDescription || DEFAULTS.metaDescription,
    heroHeading: doc.heroHeading,
    heroSubheading: doc.heroSubheading,
    footerText: doc.footerText,
    resumeUrl: doc.resumeUrl,
    resumeEnabled: doc.resumeEnabled,
    seoKeywords: doc.seoKeywords,
  };
}
