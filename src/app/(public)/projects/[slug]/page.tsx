import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Lightbulb, Target, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GitHubIcon } from "@/components/public/brand-icons";
import { Reveal } from "@/components/public/motion";
import { serverApi } from "@/lib/api-server";

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await serverApi.projectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: project.thumbnailUrl ? { images: [project.thumbnailUrl] } : undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    serverApi.projectBySlug(slug),
    serverApi.projects(),
  ]);

  if (!project) notFound();

  const others = allProjects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-4 pb-28 pt-28 sm:px-6 lg:px-8">
      <Reveal>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
          <Link href="/projects">
            <ArrowLeft data-icon="inline-start" />
            All projects
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{project.category}</Badge>
          {project.featured ? <Badge>Featured</Badge> : null}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {project.shortDescription}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.githubUrl ? (
            <Button asChild variant="outline" size="sm">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="size-3.5" />
                GitHub
              </a>
            </Button>
          ) : null}
          {project.liveUrl ? (
            <Button asChild size="sm">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink data-icon="inline-end" />
                Live Demo
              </a>
            </Button>
          ) : null}
        </div>
      </Reveal>

      <Reveal delay={0.08} className="mt-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/60">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={`${project.title} thumbnail`}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center thumb-placeholder"
            >
              <span className="font-mono text-6xl font-semibold text-primary/25">
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div className="space-y-10">
          <Reveal>
            <section aria-label="Overview">
              <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
                {project.description}
              </p>
            </section>
          </Reveal>

          {project.problem ? (
            <Reveal>
              <section aria-label="The problem" className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Target className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">The problem</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                    {project.problem}
                  </p>
                </div>
              </section>
            </Reveal>
          ) : null}

          {project.solution ? (
            <Reveal>
              <section aria-label="The solution" className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Lightbulb className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">The solution</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                    {project.solution}
                  </p>
                </div>
              </section>
            </Reveal>
          ) : null}

          {project.features?.length > 0 ? (
            <Reveal>
              <section aria-label="Features">
                <h2 className="text-xl font-semibold tracking-tight">Features</h2>
                <ul className="mt-4 space-y-2.5">
                  {project.features.map((feature: string, i: number) => (
                    <li
                      key={i}
                      className="flex gap-3 text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[9px] size-1.5 shrink-0 rounded-full bg-primary/70"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ) : null}

          {project.challenges ? (
            <Reveal>
              <section aria-label="Challenges">
                <h2 className="text-xl font-semibold tracking-tight">Challenges</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
                  {project.challenges}
                </p>
              </section>
            </Reveal>
          ) : null}

          {project.results ? (
            <Reveal>
              <section aria-label="Results" className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Trophy className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Results</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                    {project.results}
                  </p>
                </div>
              </section>
            </Reveal>
          ) : null}
        </div>

        <aside aria-label="Project details" className="lg:sticky lg:top-24 lg:self-start">
          <Reveal delay={0.1}>
            <Card className="border-border/60 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold">Technologies</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.technologies?.map((tech: string) => (
                    <li key={tech}>
                      <Badge variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    </li>
                  )) || []}
                </ul>
                <Separator className="my-5" />
                <h2 className="text-sm font-semibold">Category</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {project.category}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </aside>
      </div>

      {others.length > 0 ? (
        <div className="mt-20">
          <h2 className="text-lg font-semibold tracking-tight">More projects</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur transition-colors hover:border-primary/30"
              >
                <p className="text-sm font-medium transition-colors group-hover:text-primary">
                  {p.title}
                </p>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {p.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
