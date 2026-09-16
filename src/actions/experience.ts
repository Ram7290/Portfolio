"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { withDb } from "@/lib/mongodb";
import { ExperienceModel } from "@/models";

import type { ActionResult } from "./profile";

export type { ActionResult };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export interface ExperienceInput {
  id?: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  order: number;
}

export async function saveExperience(
  input: ExperienceInput,
): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");

  const company = input.company?.trim();
  const role = input.role?.trim();
  if (!company) return fail("Company is required.");
  if (!role) return fail("Job title is required.");
  if (!MONTH_RE.test(input.startDate ?? "")) {
    return fail("Start date must be in YYYY-MM format.");
  }
  if (!input.current && input.endDate && !MONTH_RE.test(input.endDate)) {
    return fail("End date must be in YYYY-MM format.");
  }
  if (
    !input.current &&
    input.endDate &&
    input.endDate < input.startDate
  ) {
    return fail("End date cannot be before start date.");
  }

  const fields = {
    company,
    role,
    location: input.location?.trim() || null,
    startDate: input.startDate,
    endDate: input.current ? null : input.endDate || null,
    current: input.current,
    description: input.description?.trim() ?? "",
    responsibilities: input.responsibilities.filter(Boolean),
    technologies: input.technologies.filter(Boolean),
    achievements: input.achievements.filter(Boolean),
    order: Number.isFinite(input.order) ? input.order : 0,
  };

  const result = await withDb(async () => {
    if (input.id) {
      await ExperienceModel.findByIdAndUpdate(input.id, fields);
    } else {
      await ExperienceModel.create(fields);
    }
  });

  if (result === null) return fail("Database is not configured.");

  revalidatePath("/");
  revalidatePath("/about");
  return { ok: true };
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!id) return fail("Missing id.");

  const result = await withDb(() => ExperienceModel.findByIdAndDelete(id));
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/");
  revalidatePath("/about");
  return { ok: true };
}

export async function reorderExperiences(ids: string[]): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!Array.isArray(ids) || ids.length === 0) return fail("Nothing to reorder.");

  const result = await withDb(async () => {
    await Promise.all(
      ids.map((id, index) =>
        ExperienceModel.findByIdAndUpdate(id, { order: index + 1 }),
      ),
    );
  });
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/");
  revalidatePath("/about");
  return { ok: true };
}
