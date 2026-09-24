import type { Metadata } from "next";

import { ResumeCta } from "@/components/public/resume-cta";
import { SectionHeading } from "@/components/public/motion";
import { serverApi } from "@/lib/api-server";

export const metadata: Metadata = {
  title: "Resume",
};

export default async function ResumePage() {
  const { resumeUrl } = await serverApi.siteConfig();

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
