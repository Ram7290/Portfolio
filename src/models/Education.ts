import mongoose, { Schema, type Model } from "mongoose";

import type { Education } from "@/types/portfolio";

const educationSchema = new Schema<Education>(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number, default: null },
    description: { type: String, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

educationSchema.index({ order: 1 });

export const EducationModel: Model<Education> =
  (mongoose.models.Education as Model<Education>) ??
  mongoose.model<Education>("Education", educationSchema);
