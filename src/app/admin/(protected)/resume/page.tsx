import { withDb } from "@/lib/mongodb";
import { SiteSettingsModel } from "@/models";
import { ResumeForm } from "@/components/admin/resume-form";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { isDbConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const dbOk = isDbConfigured();
  const settings = await withDb(() => SiteSettingsModel.findOne().lean());

  return (
    <>
      <PageHeader
        title="Resume"
        description="Point the resume buttons at a hosted PDF (Drive, Dropbox, S3, your own /public, …)."
      />
      <DbBanner configured={dbOk} />
      <ResumeForm
        initial={{
          resumeUrl: settings?.resumeUrl ?? "",
          resumeEnabled: settings?.resumeEnabled ?? false,
        }}
      />
    </>
  );
}
