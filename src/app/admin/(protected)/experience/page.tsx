"use client";

import { useEffect, useState } from "react";
import type { ExperienceRow } from "@/components/admin/experience-manager";
import { ExperienceManager } from "@/components/admin/experience-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { experienceApi } from "@/lib/api-client";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const result = await experienceApi.getAll();
        if (result.ok) {
          setExperiences(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch experiences:', error);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Experience"
          description="Work history shown in the timeline. Mark your current role."
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
        title="Experience"
        description="Work history shown in the timeline. Mark your current role."
      />
      <DbBanner configured={dbConfigured} />
      <ExperienceManager
        initial={experiences}
        dbConfigured={dbConfigured}
      />
    </>
  );
}
