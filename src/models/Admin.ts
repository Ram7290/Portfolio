import mongoose, { Schema, type Model } from "mongoose";

export interface AdminDoc {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<AdminDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
  },
  { timestamps: true },
);

/**
 * Seeded on first DB connection from ADMIN_EMAIL / ADMIN_PASSWORD env
 * vars (never stored in code). Password is hashed with bcrypt.
 */

export const AdminModel: Model<AdminDoc> =
  (mongoose.models.Admin as Model<AdminDoc>) ??
  mongoose.model<AdminDoc>("Admin", adminSchema);
