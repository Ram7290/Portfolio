"use client";

import { useEffect, useState } from "react";
import { ProjectsSection } from "@/components/public/projects-section";
import { SectionHeading } from "@/components/public/motion";
import { publicApi } from "@/lib/api-client";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const result = await publicApi.projects();
        setProjects(result.data || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
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
