"use client";

import type { EducationRow } from "@/components/admin/education-fields";
import { EducationManager } from "@/components/admin/education-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { PageLoading } from "@/components/admin/page-loading";
import { useApiResource } from "@/hooks/use-api-resource";
import { educationApi } from "@/lib/api-client";

export default function AdminEducationPage() {
  const { data, loading, dbConfigured, reload } = useApiResource<EducationRow[]>(
    educationApi.list,
    [],
  );

  return (
    <>
      <PageHeader
        title="Education"
        description="Degrees and studies shown on the site."
      />
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <DbBanner configured={dbConfigured} />
          <EducationManager initial={data} dbConfigured={dbConfigured} onChanged={reload} />
        </>
      )}
    </>
  );
}
