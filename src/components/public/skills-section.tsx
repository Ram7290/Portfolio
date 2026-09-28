import { Braces, Database, Server, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Marquee,
  Reveal,
  SectionHeading,
  SpotlightCard,
} from "@/components/public/motion";
import type { Skill, SkillCategory } from "@/types/portfolio";

const CATEGORY_META: Record<
  SkillCategory,
  { icon: typeof Server; blurb: string }
> = {
  Frontend: { icon: Braces, blurb: "Interfaces users enjoy" },
  Backend: { icon: Server, blurb: "APIs & server logic" },
  Databases: { icon: Database, blurb: "Data that scales with the app" },
  Tools: { icon: Wrench, blurb: "The daily workflow" },
};

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = Object.keys(CATEGORY_META) as SkillCategory[];

  return (
    <section id="skills" aria-label="Skills" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Skills"
        title="Technologies I work with"
        description="A practical toolkit built across the stack — chosen for shipping real products, not résumé padding."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {categories.map((category, ci) => {
          const items = skills.filter((s) => s.category === category);
          if (items.length === 0) return null;
          const { icon: Icon, blurb } = CATEGORY_META[category];

          return (
            <Reveal key={category} delay={ci * 0.06}>
              <SpotlightCard className="h-full rounded-xl border border-border/60 bg-card/50 backdrop-blur transition-colors hover:border-primary/30">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover/spot:scale-110 group-hover/spot:rotate-3">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{category}</h3>
                      <p className="text-xs text-muted-foreground">{blurb}</p>
                    </div>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <li key={skill.name}>
                        <Badge
                          variant="secondary"
                          className="px-2.5 py-1 text-xs transition-colors group-hover/spot:border-primary/20 hover:border-primary/40"
                          title={skill.proficiency ?? undefined}
                        >
                          {skill.name}
                          {skill.proficiency ? (
                            <span className="text-muted-foreground/70">
                              · {skill.proficiency}
                            </span>
                          ) : null}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>

      {skills.length > 0 ? (
        <Reveal delay={0.1} className="mt-8">
          <Marquee
            items={skills.map((skill) => (
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
                <span className="size-1.5 rounded-full bg-primary/70" />
                {skill.name}
              </span>
            ))}
          />
        </Reveal>
      ) : null}
    </section>
  );
}
