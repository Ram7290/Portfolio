import { Hero } from "@/components/public/hero";
import { BentoAbout } from "@/components/public/bento-about";
import { SkillsSection } from "@/components/public/skills-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { FeaturedProjects } from "@/components/public/featured-projects";
import { ServicesSection } from "@/components/public/services-section";
import { EducationSection } from "@/components/public/education-section";
import { ResumeCta } from "@/components/public/resume-cta";
import { SectionIndex } from "@/components/public/motion";
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
          name: siteSettings.heroHeading || profile.name,
          tagline: siteSettings.heroSubheading || profile.tagline,
        }}
        socialLinks={socialLinks}
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
