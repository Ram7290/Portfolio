"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/image-upload";
import { profileApi } from "@/lib/api-client";

interface ProfileFormValues {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  available: boolean;
  availabilityLabel: string;
  imageUrl: string | null;
  imagePublicId?: string | null;
  stats: Array<{ value: string; label: string }>;
}

export function ProfileForm({
  initial,
}: {
  initial: (ProfileFormValues & { id?: string }) | null;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [values, setValues] = useState<ProfileFormValues>(
    initial ?? {
      name: "",
      role: "Full Stack Developer",
      tagline: "",
      bio: "",
      location: "",
      email: "",
      available: true,
      availabilityLabel: "Open to Opportunities",
      imageUrl: null,
      imagePublicId: null,
      stats: [{ value: "", label: "" }],
    },
  );

  const set = <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K],
  ) => setValues((v) => ({ ...v, [key]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await profileApi.save({
        name: values.name,
        role: values.role,
        tagline: values.tagline,
        bio: values.bio,
        location: values.location,
        email: values.email,
        available: values.available,
        availabilityLabel: values.availabilityLabel,
        imageUrl: values.imageUrl,
        stats: values.stats,
      });
      if (result.ok) {
        toast.success("Profile saved.");
        router.refresh();
      } else {
        setError(result.error || "Save failed.");
        toast.error(result.error || "Save failed.");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity</CardTitle>
          <CardDescription>Name, role and short tagline.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="p-name">Name</Label>
            <Input
              id="p-name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-role">Role / title</Label>
            <Input
              id="p-role"
              value={values.role}
              onChange={(e) => set("role", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="p-tagline">Tagline</Label>
            <Textarea
              id="p-tagline"
              rows={2}
              value={values.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="p-bio">About (blank line = new paragraph)</Label>
            <Textarea
              id="p-bio"
              rows={7}
              value={values.bio}
              onChange={(e) => set("bio", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-location">Location</Label>
            <Input
              id="p-location"
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-email">Public email</Label>
            <Input
              id="p-email"
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile picture</CardTitle>
          <CardDescription>
            Uploaded to Cloudinary — only the URL is stored in MongoDB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploadField
            folder="profile"
            label=""
            url={values.imageUrl}
            publicId={values.imagePublicId ?? null}
            onChange={({ url }) => set("imageUrl", url)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Availability</CardTitle>
            <CardDescription>
              Shows the “Open to Opportunities” indicator.
            </CardDescription>
          </div>
          <Switch
            checked={values.available}
            onCheckedChange={(v) => set("available", v)}
            aria-label="Available for opportunities"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="p-avail-label">Availability label</Label>
            <Input
              id="p-avail-label"
              value={values.availabilityLabel}
              onChange={(e) => set("availabilityLabel", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Statistics</CardTitle>
            <CardDescription>e.g. “2+ — Years of Experience”.</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              set("stats", [...values.stats, { value: "", label: "" }])
            }
          >
            <Plus data-icon="inline-start" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {values.stats.map((stat, i) => (
            <div key={i} className="flex gap-3">
              <Input
                className="w-28 shrink-0"
                placeholder="2+"
                value={stat.value}
                onChange={(e) => {
                  const next = [...values.stats];
                  next[i] = { ...next[i], value: e.target.value };
                  set("stats", next);
                }}
                aria-label={`Stat ${i + 1} value`}
              />
              <Input
                placeholder="Years of Experience"
                value={stat.label}
                onChange={(e) => {
                  const next = [...values.stats];
                  next[i] = { ...next[i], label: e.target.value };
                  set("stats", next);
                }}
                aria-label={`Stat ${i + 1} label`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove stat"
                onClick={() =>
                  set(
                    "stats",
                    values.stats.filter((_, j) => j !== i),
                  )
                }
              >
                <Trash2 className="size-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Save className="size-4 animate-pulse" />
          ) : (
            <Save data-icon="inline-start" />
          )}
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
