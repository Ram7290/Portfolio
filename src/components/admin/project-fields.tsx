"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/image-upload";

export interface ProjectDialogValues {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  challenges: string;
  results: string;
  technologies: string[];
  category: string;
  thumbnailUrl: string | null;
  thumbnailPublicId: string | null;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
}

const CATEGORIES = ["Full Stack", "Frontend", "Backend", "Other"] as const;

const lines = (value: string) =>
  value.split("\n").map((s) => s.trim()).filter(Boolean);

const csv = (value: string) =>
  value.split(",").map((s) => s.trim()).filter(Boolean);

const inputCls =
  "h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ProjectDialogFields({
  initial,
  onSubmit,
  onCancel,
  pending,
}: {
  initial: {
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    problem: string | null;
    solution: string | null;
    features: string[];
    challenges: string | null;
    results: string | null;
    technologies: string[];
    category: string;
    thumbnailUrl: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    featured: boolean;
  } | null;
  onSubmit: (values: ProjectDialogValues) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [shortDescription, setShortDescription] = useState(
    initial?.shortDescription ?? "",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [problem, setProblem] = useState(initial?.problem ?? "");
  const [solution, setSolution] = useState(initial?.solution ?? "");
  const [features, setFeatures] = useState((initial?.features ?? []).join("\n"));
  const [challenges, setChallenges] = useState(initial?.challenges ?? "");
  const [results, setResults] = useState(initial?.results ?? "");
  const [technologies, setTechnologies] = useState(
    (initial?.technologies ?? []).join(", "),
  );
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? "");
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [thumbnail, setThumbnail] = useState<{
    url: string | null;
    publicId: string | null;
  }>({ url: initial?.thumbnailUrl ?? null, publicId: null });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Title is required.";
    if (!shortDescription.trim())
      next.shortDescription = "Short description is required.";
    for (const [key, value] of Object.entries({ githubUrl, liveUrl })) {
      if (value.trim()) {
        try {
          const parsed = new URL(value.trim());
          if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
        } catch {
          next[key] = "Must be a valid http(s) URL.";
        }
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      problem: problem.trim(),
      solution: solution.trim(),
      features: lines(features),
      challenges: challenges.trim(),
      results: results.trim(),
      technologies: csv(technologies),
      category,
      thumbnailUrl: thumbnail.url,
      thumbnailPublicId: thumbnail.publicId,
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim(),
      featured,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prj-title">Title</Label>
          <Input id="prj-title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          {errors.title ? <p role="alert" className="text-xs text-destructive">{errors.title}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="prj-slug">Slug (auto from title if blank)</Label>
          <Input id="prj-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="my-project" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prj-category">Category</Label>
          <select
            id="prj-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center justify-between self-end rounded-lg border px-3 py-2">
          <span className="text-sm font-medium">Featured</span>
          <Switch checked={featured} onCheckedChange={setFeatured} aria-label="Featured" />
        </label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prj-short">Short description</Label>
        <Textarea
          id="prj-short"
          rows={2}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />
        {errors.shortDescription ? (
          <p role="alert" className="text-xs text-destructive">{errors.shortDescription}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="prj-desc">Detailed description</Label>
        <Textarea id="prj-desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="prj-problem">Problem</Label>
          <Textarea id="prj-problem" rows={3} value={problem} onChange={(e) => setProblem(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prj-solution">Solution</Label>
          <Textarea id="prj-solution" rows={3} value={solution} onChange={(e) => setSolution(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prj-features">Features (one per line)</Label>
        <Textarea id="prj-features" rows={3} value={features} onChange={(e) => setFeatures(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="prj-challenges">Challenges</Label>
          <Textarea id="prj-challenges" rows={2} value={challenges} onChange={(e) => setChallenges(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prj-results">Results (only if real)</Label>
          <Textarea id="prj-results" rows={2} value={results} onChange={(e) => setResults(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prj-tech">Technologies (comma separated)</Label>
        <Input
          id="prj-tech"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
          placeholder="Next.js, TypeScript, MongoDB"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prj-github">GitHub URL</Label>
          <Input id="prj-github" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/…" />
          {errors.githubUrl ? <p role="alert" className="text-xs text-destructive">{errors.githubUrl}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="prj-live">Live URL</Label>
          <Input id="prj-live" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://…" />
          {errors.liveUrl ? <p role="alert" className="text-xs text-destructive">{errors.liveUrl}</p> : null}
        </div>
      </div>

      <ImageUploadField
        folder="projects"
        label="Thumbnail"
        url={thumbnail.url}
        publicId={thumbnail.publicId}
        onChange={setThumbnail}
      />

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
