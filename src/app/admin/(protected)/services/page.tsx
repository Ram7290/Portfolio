import { isDbConfigured, withDb } from "@/lib/mongodb";
import { ServiceModel } from "@/models";
import { serializeRows } from "@/lib/admin-utils";
import type { ServiceRow } from "@/components/admin/service-fields";
import { ServicesManager } from "@/components/admin/services-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const dbOk = isDbConfigured();
  const docs = await withDb(() => ServiceModel.find().sort({ order: 1 }).lean());

  return (
    <>
      <PageHeader
        title="Services"
        description="Offerings shown in the services section."
      />
      <DbBanner configured={dbOk} />
      <ServicesManager
        initial={docs ? serializeRows<ServiceRow>(docs) : []}
        dbConfigured={dbOk}
      />
    </>
  );
}
