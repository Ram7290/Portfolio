import { GraduationCap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  EditorialHeader,
  Reveal,
  SectionHeading,
} from "@/components/public/motion";
import type { Education } from "@/types/portfolio";

export function EducationSection({
  items,
  number,
}: {
  items: Education[];
  number?: string;
}) {
  return (
    <section
      id="education"
      aria-label="Education"
      className={
        number
          ? "scroll-mt-24 border-t border-border/50 pt-14 lg:pt-20"
          : "scroll-mt-20"
      }
    >
      {number ? (
        <EditorialHeader
          number={number}
          eyebrow="Education"
          title="Academic background"
          description="Where the foundations were built."
        />
      ) : (
        <SectionHeading
          eyebrow="Education"
          title="Academic background"
          description="Degrees and studies — placeholder entries are marked and editable from the admin panel."
        />
      )}

      <div
        className={
          number ? "mt-10 grid max-w-3xl gap-4 lg:mt-14" : "mx-auto mt-12 grid max-w-3xl gap-4"
        }
      >
        {items.map((edu, i) => (
          <Reveal key={i} delay={Math.min(i * 0.06, 0.2)}>
            <Card className="border-border/60 bg-card/50 backdrop-blur transition-colors hover:border-primary/30">
              <CardContent className="flex items-start gap-4 p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <GraduationCap className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-semibold tracking-tight">{edu.degree}</h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {edu.startYear} — {edu.endYear ?? "Present"}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-primary">{edu.institution}</p>
                  {edu.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {edu.description}
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
