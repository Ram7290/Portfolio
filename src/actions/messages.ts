"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { withDb } from "@/lib/mongodb";
import { ContactMessageModel } from "@/models";

import type { ActionResult } from "./profile";

export type { ActionResult };

/* ------------------------------------------------------------------ */
/* Public contact form                                                 */
/* ------------------------------------------------------------------ */

export interface ContactFormState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Naive in-memory rate limit: 5 messages per IP per 15 minutes. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

// occasional cleanup so the map cannot grow unbounded
if (typeof setInterval === "function") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of rateBuckets) {
      if (bucket.resetAt < now) rateBuckets.delete(ip);
    }
  }, 60 * 1000);
  // don't hold the event loop open (serverless)
  (timer as unknown as { unref?: () => void }).unref?.();
}

export async function submitContactForm(
  _prev: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  // Honeypot: bots fill the hidden "website" field — pretend success
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { ok: true };
  }

  // Validation (custom — no zod)
  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please enter your name.";
  else if (name.length > 120) fieldErrors.name = "Name is too long.";

  if (!email) fieldErrors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  else if (email.length > 200) fieldErrors.email = "Email is too long.";

  if (!subject) fieldErrors.subject = "Please enter a subject.";
  else if (subject.length > 200) fieldErrors.subject = "Subject is too long.";

  if (!message) fieldErrors.message = "Please enter a message.";
  else if (message.length < 10)
    fieldErrors.message = "Message must be at least 10 characters.";
  else if (message.length > 5000) fieldErrors.message = "Message is too long (max 5000).";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please fix the errors below.", fieldErrors };
  }

  // Rate limit
  const ip =
    (formData.get("__ip") as string | null) ?? "unknown"; // set by server wrapper
  if (rateLimited(ip)) {
    return {
      ok: false,
      error: "Too many messages sent. Please try again later.",
    };
  }

  const saved = await withDb(() =>
    ContactMessageModel.create({ name, email, subject, message }),
  );

  if (saved === null) {
    return {
      ok: false,
      error:
        "The contact form is not available right now. Please reach out via email instead.",
    };
  }

  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Admin message management                                            */
/* ------------------------------------------------------------------ */

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

export async function setMessageRead(
  id: string,
  read: boolean,
): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!id) return fail("Missing id.");

  const result = await withDb(() =>
    ContactMessageModel.findByIdAndUpdate(id, { read }),
  );
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!id) return fail("Missing id.");

  const result = await withDb(() => ContactMessageModel.findByIdAndDelete(id));
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}
