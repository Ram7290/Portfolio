"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadApi } from "@/lib/api-client";

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

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const result = await uploadApi.image(file, folder);
      if (result.ok && result.data) {
        onChange({ url: result.data.url, publicId: result.data.publicId });
        toast.success("Image uploaded.");
      } else {
        toast.error(result.error || "Upload failed.");
      }
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

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
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
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
              disabled={uploading}
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
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-60"
        >
          {uploading ? (
            <LoaderCircle className="size-5 animate-spin text-primary" />
          ) : (
            <ImagePlus className="size-5 text-primary" />
          )}
          {uploading ? "Uploading…" : "Click to upload image"}
          <span className="text-xs text-muted-foreground/70">
            JPEG, PNG, WebP or GIF · max 4 MB
          </span>
        </button>
      )}
    </div>
  );
}
