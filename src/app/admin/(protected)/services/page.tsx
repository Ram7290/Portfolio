"use client";

import { useEffect, useState } from "react";
import type { ServiceRow } from "@/components/admin/service-fields";
import { ServicesManager } from "@/components/admin/services-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { servicesApi } from "@/lib/api-client";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await servicesApi.getAll();
        if (result.ok) {
          setServices(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Services"
          description="Offerings shown in the services section."
        />
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Services"
        description="Offerings shown in the services section."
      />
      <DbBanner configured={dbConfigured} />
      <ServicesManager
        initial={services}
        dbConfigured={dbConfigured}
      />
    </>
  );
}
