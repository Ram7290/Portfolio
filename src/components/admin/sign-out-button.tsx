"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api-client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      const result = await authApi.logout();
      if (result.ok) {
        toast.success("Signed out successfully.");
        router.push("/admin/login");
        router.refresh();
      } else {
        toast.error(result.error || "Sign out failed.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={pending}
      className="w-full"
    >
      <LogOut data-icon="inline-start" />
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
