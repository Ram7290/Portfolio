"use client";

import { ProjectsManager, type ProjectRow } from "@/components/admin/projects-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { PageLoading } from "@/components/admin/page-loading";
import { useApiResource } from "@/hooks/use-api-resource";
import { projectsApi } from "@/lib/api-client";

export default function AdminProjectsPage() {
  const { data, loading, dbConfigured, reload } = useApiResource<ProjectRow[]>(
    projectsApi.list,
    [],
  );

  return (
    <>
      <PageHeader
        title="Projects"
        description="Case studies shown on the projects page. Featured projects appear on the homepage."
      />
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <DbBanner configured={dbConfigured} />
          <ProjectsManager initial={data} dbConfigured={dbConfigured} onChanged={reload} />
        </>
      )}
    </>
  );
}
