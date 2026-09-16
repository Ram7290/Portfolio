import mongoose, { Schema, type Model } from "mongoose";

export interface ContactMessageDoc {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: mongoose.Types.ObjectId;
}

const contactMessageSchema = new Schema<ContactMessageDoc>(
  {
    name: { type: String, required: true, trim: true, maxLength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxLength: 200,
    },
    subject: { type: String, required: true, trim: true, maxLength: 200 },
    message: { type: String, required: true, trim: true, maxLength: 5000 },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

contactMessageSchema.index({ createdAt: -1 });

export const ContactMessageModel: Model<ContactMessageDoc> =
  (mongoose.models.ContactMessage as Model<ContactMessageDoc>) ??
  mongoose.model<ContactMessageDoc>("ContactMessage", contactMessageSchema);
