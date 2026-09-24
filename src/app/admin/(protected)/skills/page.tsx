"use client";

import { useEffect, useState } from "react";
import type { SkillRow } from "@/components/admin/skill-fields";
import { SkillsManager } from "@/components/admin/skills-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { skillsApi } from "@/lib/api-client";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const result = await skillsApi.getAll();
        if (result.ok) {
          setSkills(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Skills"
          description="Create, reorder, and toggle the skills shown on the site."
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
        title="Skills"
        description="Create, reorder, and toggle the skills shown on the site."
      />
      <DbBanner configured={dbConfigured} />
      <SkillsManager
        initial={skills}
        dbConfigured={dbConfigured}
      />
    </>
  );
}
