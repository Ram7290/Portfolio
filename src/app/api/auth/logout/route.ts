import { signOut } from "@/lib/auth";
import { success } from "@/lib/api-utils";

/** POST /api/auth/logout — sign out */
export async function POST() {
  await signOut({ redirect: false });
  return success({ message: "Logged out successfully" });
}
