"use client";

import { ResumeForm } from "@/components/admin/resume-form";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { PageLoading } from "@/components/admin/page-loading";
import { useApiResource } from "@/hooks/use-api-resource";
import { settingsApi, type ResumeSettingsInput } from "@/lib/api-client";

export default function AdminResumePage() {
  const { data, loading, dbConfigured } = useApiResource<ResumeSettingsInput>(
    settingsApi.resume.get,
    { resumeUrl: "", resumeEnabled: false },
  );

  return (
    <>
      <PageHeader
        title="Resume"
        description="Point the resume buttons at a hosted PDF (Drive, Dropbox, S3, your own /public, …)."
      />
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <DbBanner configured={dbConfigured} />
          <ResumeForm initial={data} />
        </>
      )}
    </>
  );
}
