import { Hero } from "@/components/public/hero";
import { AboutSection } from "@/components/public/about-section";
import { SkillsSection } from "@/components/public/skills-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { FeaturedProjects } from "@/components/public/featured-projects";
import { ProjectsSection } from "@/components/public/projects-section";
import { ServicesSection } from "@/components/public/services-section";
import { EducationSection } from "@/components/public/education-section";
import { ResumeCta } from "@/components/public/resume-cta";
import { serverApi } from "@/lib/api-server";

export default async function HomePage() {
  const [
    profile,
    skills,
    experience,
    projects,
    services,
    education,
    siteConfig,
    siteSettings,
    socialLinks,
  ] = await Promise.all([
    serverApi.profile(),
    serverApi.skills(),
    serverApi.experience(),
    serverApi.projects(),
    serverApi.services(),
    serverApi.education(),
    serverApi.siteConfig(),
    serverApi.siteSettings(),
    serverApi.socialLinks(),
  ]);

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const resumeUrl = siteConfig.resumeUrl || "";

  return (
    <>
      <Hero
        profile={{
          ...profile,
          name: siteSettings.heroHeading || profile.name,
          tagline: siteSettings.heroSubheading || profile.tagline,
        }}
        socialLinks={socialLinks}
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
