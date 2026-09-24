import type { Metadata } from "next";

import { AboutSection } from "@/components/public/about-section";
import { SkillsSection } from "@/components/public/skills-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { EducationSection } from "@/components/public/education-section";
import { SectionHeading } from "@/components/public/motion";
import { serverApi } from "@/lib/api-server";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [profile, skills, experience, education] = await Promise.all([
    serverApi.profile(),
    serverApi.skills(),
    serverApi.experience(),
    serverApi.education(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About"
        title={`Hi, I'm ${profile.name ? profile.name.split(" ")[0] : "there"}`}
        description={profile.tagline || "Building modern web applications"}
      />
      <div className="mt-16 space-y-24">
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ExperienceSection items={experience} />
        <EducationSection items={education} />
      </div>
    </div>
  );
}
