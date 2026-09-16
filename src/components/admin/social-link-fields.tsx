"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface SocialLinkRow {
  id: string;
  platform: string;
  url: string;
  order: number;
  active: boolean;
}

export interface SocialLinkDialogValues {
  platform: string;
  url: string;
  active: boolean;
}

export function SocialLinkDialogFields({
  initial,
  onSubmit,
  onCancel,
  pending,
}: {
  initial: SocialLinkRow | null;
  onSubmit: (values: SocialLinkDialogValues) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [platform, setPlatform] = useState(initial?.platform ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!platform.trim()) next.platform = "Platform name is required.";
    if (!url.trim()) {
      next.url = "URL is required.";
    } else {
      try {
        const parsed = new URL(
          url.trim().startsWith("mailto:") ? url.trim() : url.trim(),
        );
        if (
          !["http:", "https:", "mailto:"].includes(parsed.protocol)
        ) {
          throw new Error();
        }
      } catch {
        next.url = "Must be a valid http(s) or mailto: URL.";
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({ platform: platform.trim(), url: url.trim(), active });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="link-platform">Platform</Label>
        <Input
          id="link-platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          placeholder="GitHub"
          autoFocus
        />
        {errors.platform ? (
          <p role="alert" className="text-xs text-destructive">{errors.platform}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="link-url">URL</Label>
        <Input
          id="link-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/you"
        />
        {errors.url ? (
          <p role="alert" className="text-xs text-destructive">{errors.url}</p>
        ) : null}
      </div>
      <label className="flex items-center justify-between rounded-lg border px-3 py-2.5">
        <span className="text-sm font-medium">Active (shown publicly)</span>
        <Switch checked={active} onCheckedChange={setActive} aria-label="Active" />
      </label>
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
