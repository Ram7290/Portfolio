"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { withDb } from "@/lib/mongodb";
import { EducationModel, ServiceModel } from "@/models";

import type { ActionResult } from "./profile";

export type { ActionResult };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export interface ServiceInput {
  id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

export async function saveService(input: ServiceInput): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");

  const title = input.title?.trim();
  if (!title) return fail("Service title is required.");

  const fields = {
    title,
    description: input.description?.trim() ?? "",
    icon: input.icon?.trim() || "sparkles",
    order: Number.isFinite(input.order) ? input.order : 0,
    active: input.active,
  };

  const result = await withDb(async () => {
    if (input.id) {
      await ServiceModel.findByIdAndUpdate(input.id, fields);
    } else {
      await ServiceModel.create(fields);
    }
  });
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/");
  return { ok: true };
}

export async function deleteService(id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!id) return fail("Missing id.");

  const result = await withDb(() => ServiceModel.findByIdAndDelete(id));
  if (result === null) return fail("Database is not configured.");
  revalidatePath("/");
  return { ok: true };
}

export async function reorderServices(ids: string[]): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!Array.isArray(ids) || ids.length === 0) return fail("Nothing to reorder.");

  const result = await withDb(async () => {
    await Promise.all(
      ids.map((id, index) =>
        ServiceModel.findByIdAndUpdate(id, { order: index + 1 }),
      ),
    );
  });
  if (result === null) return fail("Database is not configured.");
  revalidatePath("/");
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export interface EducationInput {
  id?: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  description: string;
  order: number;
}

export async function saveEducation(
  input: EducationInput,
): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");

  const degree = input.degree?.trim();
  const institution = input.institution?.trim();
  if (!degree) return fail("Degree is required.");
  if (!institution) return fail("Institution is required.");

  const year = Number(input.startYear);
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return fail("Start year must be a valid year.");
  }
  if (input.endYear != null) {
    const endYear = Number(input.endYear);
    if (!Number.isInteger(endYear) || endYear < year || endYear > 2100) {
      return fail("End year must be a valid year on/after the start year.");
    }
  }

  const fields = {
    degree,
    institution,
    startYear: year,
    endYear: input.endYear != null ? Number(input.endYear) : null,
    description: input.description?.trim() || null,
    order: Number.isFinite(input.order) ? input.order : 0,
  };

  const result = await withDb(async () => {
    if (input.id) {
      await EducationModel.findByIdAndUpdate(input.id, fields);
    } else {
      await EducationModel.create(fields);
    }
  });
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/");
  revalidatePath("/about");
  return { ok: true };
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!id) return fail("Missing id.");

  const result = await withDb(() => EducationModel.findByIdAndDelete(id));
  if (result === null) return fail("Database is not configured.");
  revalidatePath("/");
  revalidatePath("/about");
  return { ok: true };
}

export async function reorderEducation(ids: string[]): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!Array.isArray(ids) || ids.length === 0) return fail("Nothing to reorder.");

  const result = await withDb(async () => {
    await Promise.all(
      ids.map((id, index) =>
        EducationModel.findByIdAndUpdate(id, { order: index + 1 }),
      ),
    );
  });
  if (result === null) return fail("Database is not configured.");
  revalidatePath("/");
  revalidatePath("/about");
  return { ok: true };
}
