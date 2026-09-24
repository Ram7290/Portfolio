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
  getProfile,
  getSkills,
  getExperience,
  getProjects,
  getServices,
  getEducation,
  getSiteConfig,
  getSocialLinks,
} from "@/lib/content";

export default async function HomePage() {
  // Fetch all data server-side in parallel - no loading states needed!
  const [
    profile,
    skills,
    experience,
    projects,
    services,
    education,
    siteConfig,
    socialLinks,
  ] = await Promise.all([
    getProfile(),
    getSkills(),
    getExperience(),
    getProjects(),
    getServices(),
    getEducation(),
    getSiteConfig(),
    getSocialLinks(),
  ]);

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
