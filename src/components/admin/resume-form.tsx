"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { saveResumeSettings } from "@/actions/settings";

export function ResumeForm({
  initial,
}: {
  initial: { resumeUrl: string; resumeEnabled: boolean };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [resumeUrl, setResumeUrl] = useState(initial.resumeUrl);
  const [resumeEnabled, setResumeEnabled] = useState(initial.resumeEnabled);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveResumeSettings({ resumeUrl, resumeEnabled });
      if (result.ok) {
        toast.success("Resume settings saved.");
        router.refresh();
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resume file</CardTitle>
          <CardDescription>
            The resume button stays disabled until a URL is set and enabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="resume-url">Resume URL</Label>
            <Input
              id="resume-url"
              type="url"
              placeholder="https://…"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
            />
          </div>
          <label className="flex items-center justify-between rounded-lg border px-3 py-2.5">
            <span className="text-sm font-medium">
              Show “Download Resume” buttons
            </span>
            <Switch
              checked={resumeEnabled}
              onCheckedChange={setResumeEnabled}
              aria-label="Enable resume button"
            />
          </label>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              <Save data-icon="inline-start" />
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
