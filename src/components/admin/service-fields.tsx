"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const SERVICE_ICONS = [
  "layers",
  "palette",
  "server",
  "database",
  "rocket",
  "wrench",
  "sparkles",
] as const;

export interface ServiceRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface ServiceDialogValues {
  title: string;
  description: string;
  icon: string;
  active: boolean;
}

export function ServiceDialogFields({
  initial,
  onSubmit,
  onCancel,
  pending,
}: {
  initial: ServiceRow | null;
  onSubmit: (values: ServiceDialogValues) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "sparkles");
  const [active, setActive] = useState(initial?.active ?? true);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Service title is required.");
      return;
    }
    setError(null);
    onSubmit({ title: title.trim(), description: description.trim(), icon, active });
  }

  const inputCls =
    "h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="svc-title">Title</Label>
        <Input id="svc-title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        {error ? <p role="alert" className="text-xs text-destructive">{error}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="svc-desc">Description</Label>
        <Textarea id="svc-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="svc-icon">Icon</Label>
          <select
            id="svc-icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className={inputCls}
          >
            {SERVICE_ICONS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center justify-between rounded-lg border px-3 py-2">
          <span className="text-sm font-medium">Active</span>
          <Switch checked={active} onCheckedChange={setActive} aria-label="Active" />
        </label>
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
