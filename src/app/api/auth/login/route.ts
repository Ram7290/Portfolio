import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import {
  badRequest,
  loginConfigError,
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

  const configError = await loginConfigError();
  if (configError) return serverError(configError);

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
