import { withDb } from "@/lib/mongodb";
import { SkillModel } from "@/models";
import { serializeRows } from "@/lib/admin-utils";
import type { SkillRow } from "@/components/admin/skill-fields";
import { SkillsManager } from "@/components/admin/skills-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const dbOk = Boolean(process.env.MONGODB_URI);
  const docs = await withDb(() => SkillModel.find().sort({ order: 1 }).lean());

  return (
    <>
      <PageHeader
        title="Skills"
        description="Create, reorder, and toggle the skills shown on the site."
      />
      <DbBanner configured={dbOk} />
      <SkillsManager
        initial={docs ? serializeRows<SkillRow>(docs) : []}
        dbConfigured={dbOk}
      />
    </>
  );
}
