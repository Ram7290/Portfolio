"use client";

import { useEffect, useState } from "react";
import type { ProjectRow } from "@/components/admin/projects-manager";
import { ProjectsManager } from "@/components/admin/projects-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { projectsApi } from "@/lib/api-client";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await projectsApi.getAll();
        if (result.ok) {
          setProjects(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Projects"
          description="Case studies shown on the projects page. Featured projects appear on the homepage."
        />
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description="Case studies shown on the projects page. Featured projects appear on the homepage."
      />
      <DbBanner configured={dbConfigured} />
      <ProjectsManager
        initial={projects}
        dbConfigured={dbConfigured}
      />
    </>
  );
}
