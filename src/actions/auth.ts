"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/lib/auth";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/admin");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Report configuration problems honestly instead of blaming the credentials.
  if (!isDbConfigured()) {
    return {
      error:
        "Server is not configured: MONGODB_URI is missing. Add it to this deployment's environment variables and redeploy.",
    };
  }

  // A sign-in click deserves a real connection attempt, not a cached failure.
  if (!(await connectToDatabase({ bypassCooldown: true }))) {
    return {
      error:
        "Cannot reach the database. Check that MONGODB_URI is correct and that MongoDB Atlas → Network Access allows this server (0.0.0.0/0 for serverless hosts).",
    };
  }

  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
    return {
      error:
        "Server is not configured: AUTH_SECRET is missing. Add it to this deployment's environment variables and redeploy.",
    };
  }

  let error: string | undefined;
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      // Only a credentials mismatch should blame the credentials.
      error =
        err.type === "CredentialsSignin"
          ? "Invalid email or password."
          : `Sign-in failed (${err.type}). Check the server configuration and logs.`;
    } else {
      throw err;
    }
  }

  if (error) return { error };

  // only allow internal callbacks
  redirect(callbackUrl.startsWith("/admin") ? callbackUrl : "/admin");
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}
