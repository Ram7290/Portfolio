import { Badge } from "@/components/ui/badge";
import { Reveal, SectionHeading } from "@/components/public/motion";
import type { Experience } from "@/types/portfolio";

function formatMonth(value: string | null): string {
  if (!value) return "Present";
  const [y, m] = value.split("-").map(Number);
  if (!y || !m) return value;
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function ExperienceSection({ items }: { items: Experience[] }) {
  return (
    <section id="experience" aria-label="Experience" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Experience"
        title="Where I've worked"
        description="Roles and responsibilities — placeholder entries are marked and editable from the admin panel."
      />

      <ol className="relative mt-12 space-y-10 before:absolute before:inset-y-2 before:left-[7px] before:w-px before:bg-border/70">
        {items.map((exp, i) => (
          <li key={i} className="relative pl-10">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1.5 flex size-[15px] items-center justify-center rounded-full border-2 ${
                exp.current
                  ? "border-primary bg-primary/30"
                  : "border-border bg-card"
              }`}
            >
              {exp.current ? (
                <span className="size-1.5 rounded-full bg-primary" />
              ) : null}
            </span>

            <Reveal delay={Math.min(i * 0.05, 0.2)}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold tracking-tight">
                  {exp.role}
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatMonth(exp.startDate)} —{" "}
                  {exp.current ? "Present" : formatMonth(exp.endDate ?? null)}
                </p>
              </div>
              <p className="mt-1 text-sm font-medium text-primary">
                {exp.company}
                {exp.location ? (
                  <span className="text-muted-foreground"> · {exp.location}</span>
                ) : null}
              </p>
              {exp.description ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
              ) : null}
              {exp.responsibilities.length > 0 ? (
                <ul className="mt-4 space-y-1.5">
                  {exp.responsibilities.map((r, ri) => (
                    <li
                      key={ri}
                      className="flex gap-2.5 text-sm text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] size-1 shrink-0 rounded-full bg-primary/70"
                      />
                      {r}
                    </li>
                  ))}
                </ul>
              ) : null}
              {exp.technologies.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <li key={tech}>
                      <Badge variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
