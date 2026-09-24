"use client";

import { useEffect, useState } from "react";
import { ResumeCta } from "@/components/public/resume-cta";
import { SectionHeading } from "@/components/public/motion";
import { publicApi } from "@/lib/api-client";

export default function ResumePage() {
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeSettings = async () => {
      try {
        const result = await publicApi.getSiteConfig();
        if (result.ok) {
          setResumeUrl(result.data.resumeUrl || "");
        }
      } catch (error) {
        console.error('Failed to fetch resume settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeSettings();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-28 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Resume"
        title="Want to know more about my experience?"
        description="A one-page summary of my skills, experience, and education — kept up to date."
      />
      <div className="mx-auto mt-14 max-w-3xl">
        <ResumeCta resumeUrl={resumeUrl} enabled={Boolean(resumeUrl)} />
      </div>
    </div>
  );
}
