import type { Metadata } from "next";

import { AboutSection } from "@/components/public/about-section";
import { SkillsSection } from "@/components/public/skills-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { EducationSection } from "@/components/public/education-section";
import { SectionHeading } from "@/components/public/motion";
import {
  getEducation,
  getExperience,
  getProfile,
  getSkills,
} from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description:
    "About Ramduth Rajesh — Full Stack Developer working with React, Next.js, Node.js, and MongoDB.",
};

export default async function AboutPage() {
  const [profile, skills, experience, education] = await Promise.all([
    getProfile(),
    getSkills(),
    getExperience(),
    getEducation(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About"
        title={`Hi, I'm ${profile.name.split(" ")[0]}`}
        description={profile.tagline}
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
