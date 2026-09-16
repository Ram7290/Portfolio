import mongoose, { Schema, type Model } from "mongoose";

import type { SocialLinkItem } from "@/types/portfolio";

const socialLinkSchema = new Schema<SocialLinkItem>(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

socialLinkSchema.index({ order: 1 });

export const SocialLinkModel: Model<SocialLinkItem> =
  (mongoose.models.SocialLink as Model<SocialLinkItem>) ??
  mongoose.model<SocialLinkItem>("SocialLink", socialLinkSchema);
