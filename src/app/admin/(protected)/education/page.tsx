"use client";

import { useEffect, useState } from "react";
import type { EducationRow } from "@/components/admin/education-fields";
import { EducationManager } from "@/components/admin/education-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { educationApi } from "@/lib/api-client";

export default function AdminEducationPage() {
  const [education, setEducation] = useState<EducationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const result = await educationApi.getAll();
        if (result.ok) {
          setEducation(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch education:', error);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Education"
          description="Degrees and studies shown on the site."
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
        title="Education"
        description="Degrees and studies shown on the site."
      />
      <DbBanner configured={dbConfigured} />
      <EducationManager
        initial={education}
        dbConfigured={dbConfigured}
      />
    </>
  );
}
