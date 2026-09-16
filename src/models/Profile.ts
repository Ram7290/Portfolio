import mongoose, { Schema, type Model } from "mongoose";

import type { Profile, StatItem } from "@/types/portfolio";

/**
 * Single-document collection holding the site owner's profile.
 */

const statSchema = new Schema<StatItem>(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const profileSchema = new Schema<Profile>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    bio: { type: [String], default: [] },
    imageUrl: { type: String, default: null },
    location: { type: String, default: "" },
    email: { type: String, default: "" },
    available: { type: Boolean, default: true },
    availabilityLabel: { type: String, default: "Open to Opportunities" },
    stats: { type: [statSchema], default: [] },
  },
  { timestamps: true },
);

export const ProfileModel: Model<Profile> =
  (mongoose.models.Profile as Model<Profile>) ??
  mongoose.model<Profile>("Profile", profileSchema);
