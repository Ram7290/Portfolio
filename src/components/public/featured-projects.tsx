import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EditorialHeader,
  Reveal,
  SpotlightCard,
} from "@/components/public/motion";
import { GitHubIcon } from "@/components/public/brand-icons";
import type { Project } from "@/types/portfolio";

export function FeaturedProjects({
  projects,
  number,
}: {
  projects: Project[];
  number?: string;
}) {
  if (projects.length === 0) return null;

  return (
    <section
      id="featured"
      aria-label="Featured projects"
      className={
        number
          ? "scroll-mt-24 border-t border-border/50 pt-14 lg:pt-20"
          : "scroll-mt-20"
      }
    >
      <EditorialHeader
        number={number ?? "—"}
        eyebrow="Selected Work"
        title="Things I've built"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects">
              All projects
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <div className="mt-10 space-y-8 lg:mt-14">
        {projects.map((project, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={project.slug} delay={Math.min(i * 0.05, 0.15)}>
              <SpotlightCard
                as="article"
                className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur transition-colors hover:border-primary/30"
                contentClassName={`grid items-center gap-6 p-5 sm:gap-8 lg:grid-cols-2 lg:p-7 ${
                  flip ? "lg:[&>a:first-of-type]:order-2" : ""
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
                      className="object-cover transition-transform duration-500 group-hover/spot:scale-105"
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
                  <div className="mb-3 flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-6 bg-border" />
                    <Badge variant="secondary">{project.category}</Badge>
                  </div>
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
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
