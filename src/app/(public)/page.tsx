import { Hero } from "@/components/public/hero";
import { BentoAbout } from "@/components/public/bento-about";
import { SkillsSection } from "@/components/public/skills-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { FeaturedProjects } from "@/components/public/featured-projects";
import { ServicesSection } from "@/components/public/services-section";
import { EducationSection } from "@/components/public/education-section";
import { ResumeCta } from "@/components/public/resume-cta";
import { SectionIndex } from "@/components/public/motion";
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

  const indexSections = [
    { id: "home", label: "Top" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    ...(featured.length ? [{ id: "featured", label: "Work" }] : []),
    { id: "services", label: "Services" },
    { id: "education", label: "Education" },
  ];

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
      <SectionIndex sections={indexSections} />
      <div className="mx-auto max-w-6xl space-y-16 px-4 pb-28 sm:px-6 lg:space-y-20 lg:px-8">
        <BentoAbout profile={profile} skills={skills} />
        <SkillsSection skills={skills} number="02" />
        <ExperienceSection items={experience} number="03" />
        <FeaturedProjects projects={featured} number="04" />
        <ServicesSection services={services} number="05" />
        <EducationSection items={education} number="06" />
        <ResumeCta resumeUrl={resumeUrl} enabled={Boolean(resumeUrl)} />
      </div>
    </>
  );
}
