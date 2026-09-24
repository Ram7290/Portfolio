"use client";

import type { ServiceRow } from "@/components/admin/service-fields";
import { ServicesManager } from "@/components/admin/services-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { PageLoading } from "@/components/admin/page-loading";
import { useApiResource } from "@/hooks/use-api-resource";
import { servicesApi } from "@/lib/api-client";

export default function AdminServicesPage() {
  const { data, loading, dbConfigured, reload } = useApiResource<ServiceRow[]>(
    servicesApi.list,
    [],
  );

  return (
    <>
      <PageHeader
        title="Services"
        description="Offerings shown in the services section."
      />
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <DbBanner configured={dbConfigured} />
          <ServicesManager initial={data} dbConfigured={dbConfigured} onChanged={reload} />
        </>
      )}
    </>
  );
}
