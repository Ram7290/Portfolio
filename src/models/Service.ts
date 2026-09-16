import mongoose, { Schema, type Model } from "mongoose";

import type { Service } from "@/types/portfolio";

const serviceSchema = new Schema<Service>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "sparkles" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

serviceSchema.index({ order: 1 });

export const ServiceModel: Model<Service> =
  (mongoose.models.Service as Model<Service>) ??
  mongoose.model<Service>("Service", serviceSchema);
