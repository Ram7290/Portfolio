"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { settingsApi } from "@/lib/api-client";

interface SettingsValues {
  siteTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  footerText: string;
  seoKeywords: string;
}

export function SettingsForm({ initial }: { initial: SettingsValues }) {
  const [pending, setPending] = useState(false);
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof SettingsValues, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await settingsApi.site.save({
        siteTitle: values.siteTitle,
        metaDescription: values.metaDescription,
        heroHeading: values.heroHeading,
        heroSubheading: values.heroSubheading,
        footerText: values.footerText,
        accentColor: null,
        seoKeywords: values.seoKeywords.split(",").map((s) => s.trim()).filter(Boolean),
      });
      if (result.ok) {
        toast.success("Settings saved.");
      } else {
        const message = result.error || "Save failed.";
        setError(message);
        toast.error(message);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Site identity</CardTitle>
          <CardDescription>
            Used for the browser title, metadata, and SEO.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="s-title">Site title</Label>
            <Input
              id="s-title"
              value={values.siteTitle}
              onChange={(e) => set("siteTitle", e.target.value)}
              placeholder="Ramduth Rajesh — Full Stack Developer"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-desc">Meta description</Label>
            <Textarea
              id="s-desc"
              rows={2}
              value={values.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-keywords">SEO keywords (comma separated)</Label>
            <Input
              id="s-keywords"
              value={values.seoKeywords}
              onChange={(e) => set("seoKeywords", e.target.value)}
              placeholder="full stack developer, next.js, react"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hero content</CardTitle>
          <CardDescription>
            Optional overrides — leave blank to use profile name and tagline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="s-hero-h">Hero heading</Label>
            <Input
              id="s-hero-h"
              value={values.heroHeading}
              onChange={(e) => set("heroHeading", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-hero-s">Hero subheading</Label>
            <Input
              id="s-hero-s"
              value={values.heroSubheading}
              onChange={(e) => set("heroSubheading", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Footer</CardTitle>
          <CardDescription>
            A short line shown above the copyright.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="s-footer">Footer text</Label>
            <Input
              id="s-footer"
              value={values.footerText}
              onChange={(e) => set("footerText", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          <Save data-icon="inline-start" />
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
