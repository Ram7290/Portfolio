"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { withDb } from "@/lib/mongodb";
import { ProjectModel } from "@/models";

import type { ActionResult } from "./profile";

export type { ActionResult };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

const CATEGORIES = ["Full Stack", "Frontend", "Backend", "Other"] as const;
type CategoryValue = (typeof CATEGORIES)[number];

export interface ProjectInput {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  challenges: string;
  results: string;
  technologies: string[];
  category: string;
  thumbnailUrl: string | null;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function saveProject(input: ProjectInput): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");

  const title = input.title?.trim();
  const shortDescription = input.shortDescription?.trim();
  if (!title) return fail("Project title is required.");
  if (!shortDescription) return fail("Short description is required.");
  if (!CATEGORIES.includes(input.category as (typeof CATEGORIES)[number])) {
    return fail("Invalid category.");
  }

  const slug = slugify(input.slug || title);
  if (!slug) return fail("Could not derive a slug. Provide one explicitly.");
  const category = input.category as CategoryValue;
  if (!CATEGORIES.includes(category)) return fail("Invalid category.");

  const fields = {
    title,
    slug,
    shortDescription,
    description: input.description?.trim() ?? "",
    problem: input.problem?.trim() || null,
    solution: input.solution?.trim() || null,
    features: input.features.filter(Boolean),
    challenges: input.challenges?.trim() || null,
    results: input.results?.trim() || null,
    technologies: input.technologies.filter(Boolean),
    category,
    thumbnailUrl: input.thumbnailUrl,
    githubUrl: input.githubUrl?.trim() || null,
    liveUrl: input.liveUrl?.trim() || null,
    featured: input.featured,
    order: Number.isFinite(input.order) ? input.order : 0,
  };

  const result = await withDb(async () => {
    // slug uniqueness check (id-aware)
    const clash = await ProjectModel.findOne({ slug, _id: { $ne: input.id ?? undefined } });
    if (clash) throw new Error("SLUG_TAKEN");

    if (input.id) {
      await ProjectModel.findByIdAndUpdate(input.id, fields);
    } else {
      await ProjectModel.create(fields);
    }
  });

  if (result === null) {
    return fail("Database is not configured.");
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!id) return fail("Missing id.");

  const result = await withDb(() => ProjectModel.findByIdAndDelete(id));
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/");
  revalidatePath("/projects");
  return { ok: true };
}

export async function reorderProjects(ids: string[]): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!Array.isArray(ids) || ids.length === 0) return fail("Nothing to reorder.");

  const result = await withDb(async () => {
    await Promise.all(
      ids.map((id, index) =>
        ProjectModel.findByIdAndUpdate(id, { order: index + 1 }),
      ),
    );
  });
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/");
  revalidatePath("/projects");
  return { ok: true };
}
