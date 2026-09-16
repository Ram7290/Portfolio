"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export interface ExperienceDialogValues {
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
}

const lines = (value: string) =>
  value.split("\n").map((s) => s.trim()).filter(Boolean);

const csv = (value: string) =>
  value.split(",").map((s) => s.trim()).filter(Boolean);

export function ExperienceDialogFields({
  initial,
  onSubmit,
  onCancel,
  pending,
}: {
  initial: {
    company: string;
    role: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    current: boolean;
    description: string;
    responsibilities: string[];
    technologies: string[];
    achievements: string[];
  } | null;
  onSubmit: (values: ExperienceDialogValues) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [company, setCompany] = useState(initial?.company ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [current, setCurrent] = useState(initial?.current ?? false);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [responsibilities, setResponsibilities] = useState(
    (initial?.responsibilities ?? []).join("\n"),
  );
  const [technologies, setTechnologies] = useState(
    (initial?.technologies ?? []).join(", "),
  );
  const [achievements, setAchievements] = useState(
    (initial?.achievements ?? []).join("\n"),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!company.trim()) next.company = "Company is required.";
    if (!role.trim()) next.role = "Job title is required.";
    if (!/^\d{4}-\d{2}$/.test(startDate))
      next.startDate = "Use YYYY-MM format (month picker).";
    if (!current && endDate && !/^\d{4}-\d{2}$/.test(endDate))
      next.endDate = "Use YYYY-MM format (or clear the field).";
    if (!current && endDate && startDate && endDate < startDate)
      next.endDate = "End date cannot be before start date.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      startDate,
      endDate: current ? "" : endDate,
      current,
      description: description.trim(),
      responsibilities: lines(responsibilities),
      technologies: csv(technologies),
      achievements: lines(achievements),
    });
  }

  const inputCls = "h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exp-role">Job title</Label>
          <Input id="exp-role" value={role} onChange={(e) => setRole(e.target.value)} autoFocus />
          {errors.role ? <p role="alert" className="text-xs text-destructive">{errors.role}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="exp-company">Company</Label>
          <Input id="exp-company" value={company} onChange={(e) => setCompany(e.target.value)} />
          {errors.company ? <p role="alert" className="text-xs text-destructive">{errors.company}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exp-start">Start</Label>
          <input
            id="exp-start"
            type="month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputCls}
          />
          {errors.startDate ? <p role="alert" className="text-xs text-destructive">{errors.startDate}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="exp-end">End</Label>
          <input
            id="exp-end"
            type="month"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={current}
            className={`${inputCls} disabled:opacity-50`}
          />
          {errors.endDate ? <p role="alert" className="text-xs text-destructive">{errors.endDate}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="exp-location">Location</Label>
          <Input id="exp-location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>

      <label className="flex items-center justify-between rounded-lg border px-3 py-2.5">
        <span className="text-sm font-medium">This is my current position</span>
        <Switch checked={current} onCheckedChange={setCurrent} aria-label="Current position" />
      </label>

      <div className="space-y-2">
        <Label htmlFor="exp-desc">Description</Label>
        <Textarea id="exp-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exp-resp">Responsibilities (one per line)</Label>
        <Textarea id="exp-resp" rows={3} value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exp-tech">Technologies (comma separated)</Label>
          <Input id="exp-tech" value={technologies} onChange={(e) => setTechnologies(e.target.value)} placeholder="Next.js, Node.js" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exp-ach">Achievements (one per line)</Label>
          <Textarea id="exp-ach" rows={2} value={achievements} onChange={(e) => setAchievements(e.target.value)} />
        </div>
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
