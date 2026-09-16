import mongoose, { Schema, type Model } from "mongoose";

import type { Skill, SkillCategory } from "@/types/portfolio";

const skillSchema = new Schema<Skill>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Databases", "Tools"],
      default: "Frontend",
    },
    icon: { type: String, default: null },
    proficiency: { type: String, default: null },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

skillSchema.index({ order: 1 });
skillSchema.index({ category: 1, order: 1 });

export const SkillModel: Model<Skill> =
  (mongoose.models.Skill as Model<Skill>) ??
  mongoose.model<Skill>("Skill", skillSchema);

export type { SkillCategory };
