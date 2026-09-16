"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CATEGORIES = ["Frontend", "Backend", "Databases", "Tools"] as const;

export interface SkillRow {
  id: string;
  name: string;
  category: string;
  proficiency: string | null;
  order: number;
  active: boolean;
}

export interface SkillDialogFields {
  name: string;
  category: string;
  proficiency: string;
}

export function SkillDialogFields({
  initial,
  onSubmit,
  onCancel,
  pending,
}: {
  initial: SkillRow | null;
  onSubmit: (values: SkillDialogFields) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [proficiency, setProficiency] = useState(initial?.proficiency ?? "");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Skill name is required.");
      return;
    }
    setError(null);
    onSubmit({ name: name.trim(), category, proficiency: proficiency.trim() });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="skill-name">Name</Label>
        <Input
          id="skill-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="React"
          autoFocus
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="skill-category">Category</Label>
          <select
            id="skill-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="skill-proficiency">Proficiency (optional)</Label>
          <Input
            id="skill-proficiency"
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            placeholder="Advanced"
          />
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
