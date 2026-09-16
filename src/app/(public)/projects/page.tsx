import type { Metadata } from "next";

import { ProjectsSection } from "@/components/public/projects-section";
import { SectionHeading } from "@/components/public/motion";
import { getProjects } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects by Ramduth Rajesh — full stack applications, APIs, and interfaces.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Projects"
        title="Things I've built"
        description="A mix of full stack apps, APIs, and interface work — each with its own constraints and lessons."
      />
      <div className="mt-14">
        <ProjectsSection projects={projects} />
      </div>
    </div>
  );
}
