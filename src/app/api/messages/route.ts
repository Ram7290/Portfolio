import { withDb } from "@/lib/mongodb";
import { ContactMessageModel } from "@/models";
import {
  badRequest,
  parseRequestBody,
  requireAdmin,
  revalidatePaths,
  serverError,
  success,
  unauthorized,
} from "@/lib/api-utils";

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

// Cleanup
if (typeof setInterval === "function") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of rateBuckets) {
      if (bucket.resetAt < now) rateBuckets.delete(ip);
    }
  }, 60 * 1000);
  (timer as unknown as { unref?: () => void }).unref?.();
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // honeypot
}

/** GET /api/messages — list all messages (admin only) */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();

  const docs = await withDb(() =>
    ContactMessageModel.find().sort({ createdAt: -1 }).lean(),
  );
  if (docs === null) return serverError("Database is not configured.");
  return success(JSON.parse(JSON.stringify(docs)));
}

/** POST /api/messages — submit contact form (public) */
export async function POST(request: Request) {
  const body = await parseRequestBody<ContactFormInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const name = body.name?.trim();
  const email = body.email?.trim();
  const subject = body.subject?.trim();
  const message = body.message?.trim();

  // Honeypot: bots fill the hidden "website" field — pretend success
  if (body.website?.trim()) {
    return success();
  }

  // Validation
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
    return badRequest(JSON.stringify({ fieldErrors }));
  }

  // Rate limit by IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return badRequest("Too many messages sent. Please try again later.");
  }

  const saved = await withDb(() =>
    ContactMessageModel.create({ name, email, subject, message }),
  );

  if (saved === null) {
    return serverError(
      "The contact form is not available right now. Please reach out via email instead.",
    );
  }

  return success();
}
