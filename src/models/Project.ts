import mongoose, { Schema, type Model } from "mongoose";

import type { Project, ProjectCategory } from "@/types/portfolio";

const projectSchema = new Schema<Project>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    problem: { type: String, default: null },
    solution: { type: String, default: null },
    features: { type: [String], default: [] },
    challenges: { type: String, default: null },
    results: { type: String, default: null },
    technologies: { type: [String], default: [] },
    category: {
      type: String,
      enum: ["Full Stack", "Frontend", "Backend", "Other"],
      default: "Other",
    },
    thumbnailUrl: { type: String, default: null },
    githubUrl: { type: String, default: null },
    liveUrl: { type: String, default: null },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

projectSchema.index({ order: 1 });
projectSchema.index({ category: 1, order: 1 });

export const ProjectModel: Model<Project> =
  (mongoose.models.Project as Model<Project>) ??
  mongoose.model<Project>("Project", projectSchema);

export type { ProjectCategory };
