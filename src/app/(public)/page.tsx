import { Hero } from "@/components/public/hero";
import { AboutSection } from "@/components/public/about-section";
import { SkillsSection } from "@/components/public/skills-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { FeaturedProjects } from "@/components/public/featured-projects";
import { ProjectsSection } from "@/components/public/projects-section";
import { ServicesSection } from "@/components/public/services-section";
import { EducationSection } from "@/components/public/education-section";
import { ResumeCta } from "@/components/public/resume-cta";
import {
  getEducation,
  getExperience,
  getProfile,
  getProjects,
  getServices,
  getSkills,
  getSocialLinks,
} from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

export default async function HomePage() {
  const [profile, skills, experience, projects, services, education, social, settings] =
    await Promise.all([
      getProfile(),
      getSkills(),
      getExperience(),
      getProjects(),
      getServices(),
      getEducation(),
      getSocialLinks(),
      getSiteSettings(),
    ]);

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const resumeUrl =
    settings.resumeEnabled && settings.resumeUrl ? settings.resumeUrl : "";

  return (
    <>
      <Hero
        profile={{
          ...profile,
          name: settings.heroHeading || profile.name,
          tagline: settings.heroSubheading || profile.tagline,
        }}
        socialLinks={social}
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
