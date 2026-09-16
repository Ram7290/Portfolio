import { isDbConfigured, withDb } from "@/lib/mongodb";
import { EducationModel } from "@/models";
import { serializeRows } from "@/lib/admin-utils";
import type { EducationRow } from "@/components/admin/education-fields";
import { EducationManager } from "@/components/admin/education-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const dbOk = isDbConfigured();
  const docs = await withDb(() => EducationModel.find().sort({ order: 1 }).lean());

  return (
    <>
      <PageHeader
        title="Education"
        description="Degrees and studies shown on the site."
      />
      <DbBanner configured={dbOk} />
      <EducationManager
        initial={docs ? serializeRows<EducationRow>(docs) : []}
        dbConfigured={dbOk}
      />
    </>
  );
}
