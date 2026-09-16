"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <Button variant="outline" size="sm" type="submit" className="w-full">
        <LogOut data-icon="inline-start" />
        Sign out
      </Button>
    </form>
  );
}
