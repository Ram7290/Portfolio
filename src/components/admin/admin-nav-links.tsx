"use client";

import Link from "next/link";
import {
  FileText,
  FolderKanban,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  Link2,
  Briefcase,
  Settings,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/resume", label: "Resume", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: Inbox, badge: true },
  { href: "/admin/social-links", label: "Social Links", icon: Link2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNavLinks({
  unreadCount,
  pathname,
  onNavigate,
}: {
  unreadCount: number;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Admin">
      {LINKS.map(({ href, label, icon: Icon, exact, badge }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
            {badge && unreadCount > 0 ? (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
