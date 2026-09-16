import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/public/motion";

export function ResumeCta({
  resumeUrl,
  enabled,
}: {
  resumeUrl: string;
  enabled: boolean;
}) {
  return (
    <section aria-label="Resume" className="scroll-mt-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 px-6 py-12 text-center backdrop-blur sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 glow-hero opacity-70"
          />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Want to know more about my experience?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Grab a copy of my résumé for a detailed breakdown of my skills,
              work, and education.
            </p>
            <div className="mt-8">
              {enabled && resumeUrl ? (
                <Button asChild size="lg" className="px-6">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Download data-icon="inline-start" />
                    Download Resume
                  </a>
                </Button>
              ) : (
                <Button asChild variant="outline" size="lg" className="px-6">
                  <Link href="/contact">
                    Get in touch
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
