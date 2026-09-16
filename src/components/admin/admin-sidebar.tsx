"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminNavLinks } from "./admin-nav-links";

export function AdminSidebar({
  unreadCount,
  signOutButton,
}: {
  unreadCount: number;
  signOutButton: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-14 items-center gap-2.5 border-b px-5">
          <Link href="/" className="flex items-center gap-2.5 font-mono text-sm font-semibold">
            <span className="flex size-6 items-center justify-center rounded bg-primary/15 text-xs text-primary ring-1 ring-primary/25">
              RR
            </span>
            Admin
          </Link>
        </div>
        <AdminNavLinks unreadCount={unreadCount} pathname={pathname} onNavigate={() => {}} />
        <div className="border-t p-4">{signOutButton}</div>
      </aside>

      {/* Mobile topbar + sheet */}
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open admin menu">
              <PanelLeft className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex h-14 items-center gap-2.5 border-b px-5 font-mono text-sm font-semibold">
                <span className="flex size-6 items-center justify-center rounded bg-primary/15 text-xs text-primary ring-1 ring-primary/25">
                  RR
                </span>
                Admin
              </div>
              <AdminNavLinks
                unreadCount={unreadCount}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
              <div className="mt-auto border-t p-4">{signOutButton}</div>
            </div>
          </SheetContent>
        </Sheet>
        <span className="font-mono text-sm font-semibold">Admin</span>
      </div>
    </>
  );
}
