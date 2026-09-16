import { isDbConfigured, withDb } from "@/lib/mongodb";
import { ExperienceModel } from "@/models";
import { serializeRows } from "@/lib/admin-utils";
import type { ExperienceRow } from "@/components/admin/experience-manager";
import { ExperienceManager } from "@/components/admin/experience-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const dbOk = isDbConfigured();
  const docs = await withDb(() =>
    ExperienceModel.find().sort({ order: 1 }).lean(),
  );

  return (
    <>
      <PageHeader
        title="Experience"
        description="Work history shown in the timeline. Mark your current role."
      />
      <DbBanner configured={dbOk} />
      <ExperienceManager
        initial={docs ? serializeRows<ExperienceRow>(docs) : []}
        dbConfigured={dbOk}
      />
    </>
  );
}
