"use client";

import { useEffect, useState } from "react";
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
import { 
  skillsApi, 
  experienceApi, 
  projectsApi, 
  messagesApi 
} from "@/lib/api-client";

interface DashboardStats {
  projects: number;
  skills: number;
  experiences: number;
  messages: number;
  unread: number;
}

interface RecentMessage {
  id: string;
  name: string;
  subject: string;
  read: boolean;
  createdAt: string;
}

interface RecentProject {
  id: string;
  title: string;
  featured: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ 
    projects: 0, 
    skills: 0, 
    experiences: 0, 
    messages: 0, 
    unread: 0 
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const [skillsResult, experiencesResult, projectsResult, messagesResult] = await Promise.all([
        skillsApi.list(),
        experienceApi.list(),
        projectsApi.list(),
        messagesApi.list(),
      ]);

      if (skillsResult.ok && experiencesResult.ok && projectsResult.ok && messagesResult.ok) {
        const skills = skillsResult.data ?? [];
        const experiences = experiencesResult.data ?? [];
        const projects: RecentProject[] = projectsResult.data ?? [];
        const messages: RecentMessage[] = messagesResult.data ?? [];

        setStats({
          projects: projects.length,
          skills: skills.length,
          experiences: experiences.length,
          messages: messages.length,
          unread: messages.filter((m) => !m.read).length,
        });

        // Recent messages (API returns newest first)
        setRecentMessages(messages.slice(0, 5));

        // Recent projects (first 5 by order)
        setRecentProjects(projects.slice(0, 5).map((p) => ({
          id: p.id,
          title: p.title,
          featured: p.featured,
        })));
      } else {
        setDbConfigured(false);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Skills", value: stats.skills, icon: Sparkles, href: "/admin/skills" },
    { label: "Experiences", value: stats.experiences, icon: Briefcase, href: "/admin/experience" },
    { label: "Messages", value: stats.messages, icon: Inbox, href: "/admin/messages" },
  ];

  if (loading) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          description="Overview of your portfolio content."
        />
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading dashboard...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio content."
      />
      <DbBanner configured={dbConfigured} />

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
