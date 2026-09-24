import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import {
  badRequest,
  parseRequestBody,
  serverError,
  success,
} from "@/lib/api-utils";

export interface LoginInput {
  email: string;
  password: string;
}

/** POST /api/auth/login — authenticate with credentials */
export async function POST(request: Request) {
  const body = await parseRequestBody<LoginInput>(request);
  if (!body) return badRequest("Invalid request body.");

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return badRequest("Email and password are required.");
  }

  // Report configuration problems honestly
  if (!isDbConfigured()) {
    return serverError(
      "Server is not configured: MONGODB_URI is missing. Add it to this deployment's environment variables and redeploy.",
    );
  }

  // A sign-in attempt deserves a real connection attempt, not a cached failure
  if (!(await connectToDatabase({ bypassCooldown: true }))) {
    return serverError(
      "Cannot reach the database. Check that MONGODB_URI is correct and that MongoDB Atlas → Network Access allows this server (0.0.0.0/0 for serverless hosts).",
    );
  }

  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
    return serverError(
      "Server is not configured: AUTH_SECRET is missing. Add it to this deployment's environment variables and redeploy.",
    );
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
    return success({ message: "Login successful" });
  } catch (err) {
    if (err instanceof AuthError) {
      const error =
        err.type === "CredentialsSignin"
          ? "Invalid email or password."
          : `Sign-in failed (${err.type}). Check the server configuration and logs.`;
      return badRequest(error);
    }
    return serverError("An unexpected error occurred.");
  }
}
