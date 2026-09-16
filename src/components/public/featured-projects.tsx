import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/public/motion";
import { GitHubIcon } from "@/components/public/brand-icons";
import type { Project } from "@/types/portfolio";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section
      id="featured"
      aria-label="Featured projects"
      className="scroll-mt-20"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Reveal>
          <p className="font-mono text-xs font-medium tracking-[0.2em] text-primary uppercase">
            Featured
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Project highlights
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects">
              All projects
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </Reveal>
      </div>

      <div className="mt-10 space-y-10">
        {projects.map((project, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={project.slug} delay={Math.min(i * 0.05, 0.15)}>
              <article
                className={`group grid items-center gap-6 rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur transition-colors hover:border-primary/30 sm:gap-8 lg:grid-cols-2 lg:p-7 ${
                  flip ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden rounded-xl border border-border/60"
                  aria-label={`Open project: ${project.title}`}
                >
                  {project.thumbnailUrl ? (
                    <Image
                      src={project.thumbnailUrl}
                      alt={`${project.title} thumbnail`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center thumb-placeholder"
                    >
                      <span className="font-mono text-5xl font-semibold text-primary/25">
                        {project.title.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Link>

                <div>
                  <Badge variant="secondary" className="mb-3">
                    {project.category}
                  </Badge>
                  <h3 className="text-2xl font-semibold tracking-tight text-balance">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="transition-colors hover:text-primary"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
                    {project.shortDescription}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <li key={tech}>
                        <Badge variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href={`/projects/${project.slug}`}>
                        Case study
                        <ArrowUpRight data-icon="inline-end" />
                      </Link>
                    </Button>
                    {project.githubUrl ? (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GitHubIcon className="size-3.5" />
                          GitHub
                        </a>
                      </Button>
                    ) : null}
                    {project.liveUrl ? (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="size-3.5" />
                          Live Demo
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
