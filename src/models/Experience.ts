import mongoose, { Schema, type Model } from "mongoose";

import type { Experience } from "@/types/portfolio";

const experienceSchema = new Schema<Experience>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, default: null },
    startDate: { type: String, required: true }, // YYYY-MM
    endDate: { type: String, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

experienceSchema.index({ order: 1 });

export const ExperienceModel: Model<Experience> =
  (mongoose.models.Experience as Model<Experience>) ??
  mongoose.model<Experience>("Experience", experienceSchema);
