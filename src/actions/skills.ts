"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { withDb } from "@/lib/mongodb";
import { SkillModel } from "@/models";

import type { ActionResult } from "./profile";

export type { ActionResult };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

const CATEGORIES = ["Frontend", "Backend", "Databases", "Tools"] as const;
type CategoryValue = (typeof CATEGORIES)[number];

export interface SkillInput {
  id?: string;
  name: string;
  category: string;
  proficiency: string;
  order: number;
  active: boolean;
}

export async function saveSkill(input: SkillInput): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");

  const name = input.name?.trim();
  if (!name) return fail("Skill name is required.");
  const category = input.category as CategoryValue;
  if (!CATEGORIES.includes(category)) {
    return fail("Invalid category.");
  }

  const fields = {
    name,
    category,
    proficiency: input.proficiency?.trim() || null,
    order: Number.isFinite(input.order) ? input.order : 0,
    active: input.active,
  };

  const result = await withDb(async () => {
    if (input.id) {
      await SkillModel.findByIdAndUpdate(input.id, fields);
    } else {
      await SkillModel.create(fields);
    }
  });

  if (result === null) return fail("Database is not configured.");

  revalidatePath("/");
  revalidatePath("/about");
  return { ok: true };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!id) return fail("Missing id.");

  const result = await withDb(() => SkillModel.findByIdAndDelete(id));
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/");
  revalidatePath("/about");
  return { ok: true };
}

export async function toggleSkillActive(
  id: string,
  active: boolean,
): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  const result = await withDb(() =>
    SkillModel.findByIdAndUpdate(id, { active }),
  );
  if (result === null) return fail("Database is not configured.");
  revalidatePath("/");
  revalidatePath("/about");
  return { ok: true };
}

export async function reorderSkills(ids: string[]): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Not authorized");
  if (!Array.isArray(ids) || ids.length === 0) return fail("Nothing to reorder.");

  const result = await withDb(async () => {
    await Promise.all(
      ids.map((id, index) =>
        SkillModel.findByIdAndUpdate(id, { order: index + 1 }),
      ),
    );
  });
  if (result === null) return fail("Database is not configured.");

  revalidatePath("/");
  revalidatePath("/about");
  return { ok: true };
}
