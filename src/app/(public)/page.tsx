"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/public/hero";
import { AboutSection } from "@/components/public/about-section";
import { SkillsSection } from "@/components/public/skills-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { FeaturedProjects } from "@/components/public/featured-projects";
import { ProjectsSection } from "@/components/public/projects-section";
import { ServicesSection } from "@/components/public/services-section";
import { EducationSection } from "@/components/public/education-section";
import { ResumeCta } from "@/components/public/resume-cta";
import { publicApi } from "@/lib/api-client";

interface HomeData {
  profile: any;
  skills: any[];
  experience: any[];
  projects: any[];
  services: any[];
  education: any[];
  siteConfig: any;
}

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [
          profileResult,
          skillsResult,
          experienceResult,
          projectsResult,
          servicesResult,
          educationResult,
          siteConfigResult,
        ] = await Promise.all([
          publicApi.profile(),
          publicApi.skills(),
          publicApi.experience(),
          publicApi.projects(),
          publicApi.services(),
          publicApi.education(),
          publicApi.siteConfig(),
        ]);

        setData({
          profile: profileResult.data || {},
          skills: skillsResult.data || [],
          experience: experienceResult.data || [],
          projects: projectsResult.data || [],
          services: servicesResult.data || [],
          education: educationResult.data || [],
          siteConfig: siteConfigResult.data || {},
        });
      } catch (error) {
        console.error("Failed to fetch home data:", error);
        // Set fallback data
        setData({
          profile: {},
          skills: [],
          experience: [],
          projects: [],
          services: [],
          education: [],
          siteConfig: {},
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
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

  const { profile, skills, experience, projects, services, education, siteConfig } = data;
  const featured = projects.filter((p: any) => p.featured).slice(0, 3);
  const resumeUrl = siteConfig.resumeUrl || "";

  return (
    <>
      <Hero
        profile={{
          ...profile,
          name: siteConfig.heroHeading || profile.name,
          tagline: siteConfig.heroSubheading || profile.tagline,
        }}
        socialLinks={siteConfig.socialLinks || []}
        resumeUrl={resumeUrl}
      />
      <div className="mx-auto max-w-6xl space-y-28 px-4 pb-28 sm:px-6 lg:px-8">
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ExperienceSection items={experience} />
        <FeaturedProjects projects={featured} />
        <ProjectsSection projects={projects} />
        <ServicesSection services={services} />
        <EducationSection items={education} />
        <ResumeCta resumeUrl={resumeUrl} enabled={Boolean(resumeUrl)} />
      </div>
    </>
  );
}
