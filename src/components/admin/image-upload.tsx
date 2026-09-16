"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadImageAction } from "@/actions/uploads";

/**
 * Cloudinary image upload field (profile picture / project thumbnail).
 * Shows preview, replace, remove, loading and error states.
 */

export function ImageUploadField({
  folder,
  url,
  publicId,
  onChange,
  label = "Image",
}: {
  folder: "profile" | "projects";
  url: string | null;
  publicId?: string | null;
  onChange: (next: { url: string | null; publicId: string | null }) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder);
    startTransition(async () => {
      try {
        const result = await uploadImageAction(fd);
        if (result.ok) {
          onChange({ url: result.url, publicId: result.publicId });
          toast.success("Image uploaded.");
        } else {
          toast.error(result.error);
        }
      } catch {
        toast.error("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    });
  }

  const busy = uploading || pending;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) handleFile(file);
        }}
      />

      {url ? (
        <div className="flex items-start gap-3">
          <div className="relative h-24 w-40 overflow-hidden rounded-lg border">
            <Image
              src={url}
              alt="Uploaded preview"
              fill
              sizes="160px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <ImagePlus className="size-3.5" />
              )}
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => onChange({ url: null, publicId: null })}
            >
              <X className="size-3.5" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-60"
        >
          {busy ? (
            <LoaderCircle className="size-5 animate-spin text-primary" />
          ) : (
            <ImagePlus className="size-5 text-primary" />
          )}
          {busy ? "Uploading…" : "Click to upload image"}
          <span className="text-xs text-muted-foreground/70">
            JPEG, PNG, WebP or GIF · max 4 MB
          </span>
        </button>
      )}
    </div>
  );
}
