import { isDbConfigured, withDb } from "@/lib/mongodb";
import { ProjectModel } from "@/models";
import { serializeRows } from "@/lib/admin-utils";
import type { ProjectRow } from "@/components/admin/projects-manager";
import { ProjectsManager } from "@/components/admin/projects-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const dbOk = isDbConfigured();
  const docs = await withDb(() => ProjectModel.find().sort({ order: 1 }).lean());

  return (
    <>
      <PageHeader
        title="Projects"
        description="Case studies shown on the projects page. Featured projects appear on the homepage."
      />
      <DbBanner configured={dbOk} />
      <ProjectsManager
        initial={docs ? serializeRows<ProjectRow>(docs) : []}
        dbConfigured={dbOk}
      />
    </>
  );
}
