import Link from "next/link";
import {
  Briefcase,
  ExternalLink,
  FolderKanban,
  Inbox,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { isDbConfigured } from "@/lib/mongodb";
import {
  ContactMessageModel,
  ExperienceModel,
  ProjectModel,
  SkillModel,
} from "@/models";
import { withIds } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const dbOk = isDbConfigured();

  let stats = { projects: 0, skills: 0, experiences: 0, messages: 0, unread: 0 };
  let recentMessages: Array<{
    id: string;
    name: string;
    subject: string;
    read: boolean;
    createdAt: Date;
  }> = [];
  let recentProjects: Array<{ id: string; title: string; featured: boolean }> = [];

  if (dbOk) {
    try {
      const [projects, skills, experiences, messages, unread, msgs, projs] =
        await Promise.all([
          ProjectModel.countDocuments(),
          SkillModel.countDocuments(),
          ExperienceModel.countDocuments(),
          ContactMessageModel.countDocuments(),
          ContactMessageModel.countDocuments({ read: false }),
          ContactMessageModel.find().sort({ createdAt: -1 }).limit(5).lean(),
          ProjectModel.find().sort({ order: 1 }).limit(5).lean(),
        ]);
      stats = { projects, skills, experiences, messages, unread };
      recentMessages = withIds(msgs).map((m) => ({
        id: m.id,
        name: m.name,
        subject: m.subject,
        read: m.read,
        createdAt: m.createdAt,
      }));
      recentProjects = withIds(projs).map((p) => ({
        id: p.id,
        title: p.title,
        featured: p.featured,
      }));
    } catch {
      /* DB configured but unreachable — show zeros */
    }
  }

  const statCards = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Skills", value: stats.skills, icon: Sparkles, href: "/admin/skills" },
    { label: "Experiences", value: stats.experiences, icon: Briefcase, href: "/admin/experience" },
    { label: "Messages", value: stats.messages, icon: Inbox, href: "/admin/messages" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio content."
      />
      <DbBanner configured={dbOk} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="group">
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">{value}</p>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground">
                    {label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent messages</CardTitle>
            {stats.unread > 0 ? (
              <Badge>{stats.unread} unread</Badge>
            ) : null}
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No messages yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentMessages.map((m) => (
                  <li key={m.id}>
                    <Link
                      href="/admin/messages"
                      className="flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-muted/50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {m.subject}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {m.name} ·{" "}
                          {new Date(m.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </span>
                      {!m.read ? (
                        <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent projects</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/projects">
                Manage
                <ExternalLink data-icon="inline-end" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No projects yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentProjects.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <span className="truncate text-sm font-medium">{p.title}</span>
                    {p.featured ? (
                      <Badge variant="secondary" className="shrink-0">
                        Featured
                      </Badge>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
