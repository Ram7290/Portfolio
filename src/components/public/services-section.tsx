import {
  Database,
  Layers,
  Palette,
  Rocket,
  Server,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Reveal, SectionHeading } from "@/components/public/motion";
import type { Service } from "@/types/portfolio";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  palette: Palette,
  server: Server,
  database: Database,
  rocket: Rocket,
  wrench: Wrench,
  sparkles: Sparkles,
};

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="services" aria-label="Services" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Services"
        title="What I can help with"
        description="From a landing page to a full product — services scoped to real needs."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const Icon = SERVICE_ICONS[service.icon] ?? Sparkles;
          return (
            <Reveal key={service.title} delay={Math.min(i * 0.05, 0.25)}>
              <Card className="group h-full border-border/60 bg-card/50 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/30">
                <CardContent className="p-6">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
