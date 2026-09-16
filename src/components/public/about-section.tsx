import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/public/motion";
import type { Profile } from "@/types/portfolio";

export function AboutSection({ profile }: { profile: Profile }) {
  return (
    <section id="about" aria-label="About" className="scroll-mt-20">
      <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <Reveal>
          <p className="font-mono text-xs font-medium tracking-[0.2em] text-primary uppercase">
            About
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            A developer who cares about the whole stack
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            {profile.bio.map((paragraph, i) => (
              <p key={i} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
          {profile.location ? (
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {profile.location}
            </p>
          ) : null}
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            {profile.stats.map((stat) => (
              <Card
                key={stat.label}
                className="border-border/60 bg-card/50 backdrop-blur transition-colors hover:border-primary/30"
              >
                <CardContent className="p-5 text-center">
                  <p className="text-3xl font-semibold tracking-tight text-gradient">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Clean Architecture", "Type-Safe Code", "Performance", "DX"].map(
              (chip) => (
                <Badge key={chip} variant="secondary" className="px-2.5">
                  {chip}
                </Badge>
              ),
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
