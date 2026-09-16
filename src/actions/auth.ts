"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/lib/auth";

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

  let error: string | undefined;
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      error = "Invalid email or password.";
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
