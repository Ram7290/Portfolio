import mongoose, { Schema, type Model } from "mongoose";

export interface SiteSettingsDoc {
  siteTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  footerText: string;
  resumeUrl: string;
  resumeEnabled: boolean;
  accentColor: string | null;
  seoKeywords: string[];
  updatedAt: Date;
}

const siteSettingsSchema = new Schema<SiteSettingsDoc>(
  {
    siteTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    heroHeading: { type: String, default: "" },
    heroSubheading: { type: String, default: "" },
    footerText: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    resumeEnabled: { type: Boolean, default: false },
    accentColor: { type: String, default: null },
    seoKeywords: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const SiteSettingsModel: Model<SiteSettingsDoc> =
  (mongoose.models.SiteSettings as Model<SiteSettingsDoc>) ??
  mongoose.model<SiteSettingsDoc>("SiteSettings", siteSettingsSchema);
