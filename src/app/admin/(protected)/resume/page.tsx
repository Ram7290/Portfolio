"use client";

import { useEffect, useState } from "react";
import { ResumeForm } from "@/components/admin/resume-form";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { settingsApi } from "@/lib/api-client";

interface ResumeSettings {
  resumeUrl: string;
  resumeEnabled: boolean;
}

export default function AdminResumePage() {
  const [resumeSettings, setResumeSettings] = useState<ResumeSettings>({
    resumeUrl: "",
    resumeEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    const fetchResumeSettings = async () => {
      try {
        const result = await settingsApi.getSiteSettings();
        if (result.ok) {
          const data = result.data;
          setResumeSettings({
            resumeUrl: data.resumeUrl ?? "",
            resumeEnabled: data.resumeEnabled ?? false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch resume settings:', error);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeSettings();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Resume"
          description="Point the resume buttons at a hosted PDF (Drive, Dropbox, S3, your own /public, …)."
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
        title="Resume"
        description="Point the resume buttons at a hosted PDF (Drive, Dropbox, S3, your own /public, …)."
      />
      <DbBanner configured={dbConfigured} />
      <ResumeForm initial={resumeSettings} />
    </>
  );
}
