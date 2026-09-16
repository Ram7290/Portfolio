"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Reveal, SectionHeading } from "@/components/public/motion";
import { GitHubIcon } from "@/components/public/brand-icons";
import type { Project, ProjectCategory } from "@/types/portfolio";

const FILTERS: Array<{ value: ProjectCategory | "All"; label: string }> = [
  { value: "All", label: "All" },
  { value: "Full Stack", label: "Full Stack" },
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Other", label: "Other" },
];

function ProjectImage({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  if (project.thumbnailUrl) {
    return (
      <Image
        src={project.thumbnailUrl}
        alt={`${project.title} thumbnail`}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${className ?? ""}`}
      />
    );
  }
  // Generated placeholder art until a thumbnail is uploaded
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex items-center justify-center thumb-placeholder opacity-90 ${className ?? ""}`}
    >
      <span className="font-mono text-4xl font-semibold text-primary/25">
        {project.title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "All">("All");
  const reduceMotion = useReducedMotion();

  const visible =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" aria-label="Projects" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        description="Things I've designed, built, and shipped — with the reasoning behind them."
      />

      {/* Filter bar */}
      <Reveal className="mt-8">
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {FILTERS.map(({ value, label }) => {
            const active = filter === value;
            return (
              <button
                key={value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(value)}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", bounce: 0.2, duration: 0.5 }
                    }
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <motion.ul layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.li
              key={project.slug}
              layout
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            >
              <Card className="group h-full overflow-hidden border-border/60 bg-card/50 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                <Link
                  href={`/projects/${project.slug}`}
                  className="flex h-full flex-col"
                  aria-label={`Open project: ${project.title}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-border/60">
                    <ProjectImage project={project} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Badge className="absolute left-3 top-3 border-primary/20 bg-background/70 backdrop-blur text-foreground">
                      {project.category}
                    </Badge>
                    {project.featured ? (
                      <Badge className="absolute right-3 top-3 bg-primary/90 backdrop-blur">
                        Featured
                      </Badge>
                    ) : null}
                  </div>

                  <CardContent className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {project.shortDescription}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <li key={tech}>
                          <Badge variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        </li>
                      ))}
                      {project.technologies.length > 4 ? (
                        <li>
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 4}
                          </Badge>
                        </li>
                      ) : null}
                    </ul>
                  </CardContent>

                  <CardFooter className="border-t border-border/60 p-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      View details
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                    <span className="ml-auto flex items-center gap-1">
                      {project.githubUrl ? (
                        <span
                          role="link"
                          aria-label="View on GitHub"
                          tabIndex={-1}
                          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          onClick={(e) => {
                            e.preventDefault();
                            if (project.githubUrl)
                              window.open(project.githubUrl, "_blank", "noopener");
                          }}
                        >
                          <GitHubIcon className="size-4" />
                        </span>
                      ) : null}
                      {project.liveUrl ? (
                        <span
                          role="link"
                          aria-label="View live demo"
                          tabIndex={-1}
                          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          onClick={(e) => {
                            e.preventDefault();
                            if (project.liveUrl)
                              window.open(project.liveUrl, "_blank", "noopener");
                          }}
                        >
                          <ExternalLink className="size-4" />
                        </span>
                      ) : null}
                    </span>
                  </CardFooter>
                </Link>
              </Card>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No projects in this category yet.
        </p>
      ) : null}
    </section>
  );
}
