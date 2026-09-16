"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface EducationRow {
  id: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  description: string | null;
  order: number;
}

export interface EducationDialogValues {
  degree: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  description: string;
}

export function EducationDialogFields({
  initial,
  onSubmit,
  onCancel,
  pending,
}: {
  initial: EducationRow | null;
  onSubmit: (values: EducationDialogValues) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [degree, setDegree] = useState(initial?.degree ?? "");
  const [institution, setInstitution] = useState(initial?.institution ?? "");
  const [startYear, setStartYear] = useState(initial?.startYear?.toString() ?? "");
  const [endYear, setEndYear] = useState(initial?.endYear?.toString() ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!degree.trim()) next.degree = "Degree is required.";
    if (!institution.trim()) next.institution = "Institution is required.";

    const start = Number(startYear);
    if (!Number.isInteger(start) || start < 1900 || start > 2100) {
      next.startYear = "Enter a valid year.";
    }
    let end: number | null = null;
    if (endYear.trim()) {
      end = Number(endYear);
      if (!Number.isInteger(end) || end < 1900 || end > 2100) {
        next.endYear = "Enter a valid year.";
      } else if (Number.isInteger(start) && end < start) {
        next.endYear = "End year cannot be before start year.";
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({
      degree: degree.trim(),
      institution: institution.trim(),
      startYear: start,
      endYear: end,
      description: description.trim(),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edu-degree">Degree</Label>
        <Input
          id="edu-degree"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          placeholder="B.Sc. Computer Science"
          autoFocus
        />
        {errors.degree ? <p role="alert" className="text-xs text-destructive">{errors.degree}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="edu-inst">Institution</Label>
        <Input id="edu-inst" value={institution} onChange={(e) => setInstitution(e.target.value)} />
        {errors.institution ? <p role="alert" className="text-xs text-destructive">{errors.institution}</p> : null}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edu-start">Start year</Label>
          <Input id="edu-start" type="number" value={startYear} onChange={(e) => setStartYear(e.target.value)} placeholder="2019" />
          {errors.startYear ? <p role="alert" className="text-xs text-destructive">{errors.startYear}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="edu-end">End year (blank = ongoing)</Label>
          <Input id="edu-end" type="number" value={endYear} onChange={(e) => setEndYear(e.target.value)} placeholder="2023" />
          {errors.endYear ? <p role="alert" className="text-xs text-destructive">{errors.endYear}</p> : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edu-desc">Description (optional)</Label>
        <Textarea id="edu-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
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
