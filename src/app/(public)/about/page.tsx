"use client";

import { useEffect, useState } from "react";
import { AboutSection } from "@/components/public/about-section";
import { SkillsSection } from "@/components/public/skills-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { EducationSection } from "@/components/public/education-section";
import { SectionHeading } from "@/components/public/motion";
import { publicApi } from "@/lib/api-client";

interface AboutData {
  profile: any;
  skills: any[];
  experience: any[];
  education: any[];
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const [profileResult, skillsResult, experienceResult, educationResult] =
          await Promise.all([
            publicApi.profile(),
            publicApi.skills(),
            publicApi.experience(),
            publicApi.education(),
          ]);

        setData({
          profile: profileResult.data || {},
          skills: skillsResult.data || [],
          experience: experienceResult.data || [],
          education: educationResult.data || [],
        });
      } catch (error) {
        console.error("Failed to fetch about data:", error);
        setData({
          profile: {},
          skills: [],
          experience: [],
          education: [],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { profile, skills, experience, education } = data;

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
