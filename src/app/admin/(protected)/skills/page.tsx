"use client";

import type { SkillRow } from "@/components/admin/skill-fields";
import { SkillsManager } from "@/components/admin/skills-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { PageLoading } from "@/components/admin/page-loading";
import { useApiResource } from "@/hooks/use-api-resource";
import { skillsApi } from "@/lib/api-client";

export default function AdminSkillsPage() {
  const { data, loading, dbConfigured, reload } = useApiResource<SkillRow[]>(
    skillsApi.list,
    [],
  );

  return (
    <>
      <PageHeader
        title="Skills"
        description="Create, reorder, and toggle the skills shown on the site."
      />
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <DbBanner configured={dbConfigured} />
          <SkillsManager initial={data} dbConfigured={dbConfigured} onChanged={reload} />
        </>
      )}
    </>
  );
}
