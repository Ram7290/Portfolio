"use client";

import { ExperienceManager, type ExperienceRow } from "@/components/admin/experience-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { PageLoading } from "@/components/admin/page-loading";
import { useApiResource } from "@/hooks/use-api-resource";
import { experienceApi } from "@/lib/api-client";

export default function AdminExperiencePage() {
  const { data, loading, dbConfigured, reload } = useApiResource<ExperienceRow[]>(
    experienceApi.list,
    [],
  );

  return (
    <>
      <PageHeader
        title="Experience"
        description="Work history shown in the timeline. Mark your current role."
      />
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <DbBanner configured={dbConfigured} />
          <ExperienceManager initial={data} dbConfigured={dbConfigured} onChanged={reload} />
        </>
      )}
    </>
  );
}
