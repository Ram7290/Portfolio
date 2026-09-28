import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import {
  CountUp,
  EditorialHeader,
  Marquee,
  Reveal,
  SpotlightCard,
} from "@/components/public/motion";
import type { Profile, Skill } from "@/types/portfolio";

const TILE =
  "h-full rounded-2xl border border-border/60 bg-card/50 backdrop-blur transition-colors hover:border-primary/30";

export function BentoAbout({
  profile,
  skills,
}: {
  profile: Profile;
  skills: Skill[];
}) {
  return (
    <section
      id="about"
      aria-label="About"
      className="scroll-mt-24 border-t border-border/50 pt-14 lg:pt-20"
    >
      <EditorialHeader
        number="01"
        eyebrow="About"
        title="A developer who cares about the whole stack"
      />

      <Reveal className="mt-10 lg:mt-14">
        <div className="grid auto-rows-[minmax(9.5rem,auto)] grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Bio — the anchor tile */}
          <SpotlightCard
            className={`${TILE} col-span-2 lg:row-span-2`}
            contentClassName="flex h-full flex-col p-6 sm:p-7"
          >
            <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
              {"// "}
              {profile.role}
            </p>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
              {profile.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              {["Clean Architecture", "Type-Safe", "Performance", "DX"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </SpotlightCard>

          {/* Photo — full-bleed portrait */}
          <div
            className={`${TILE} group relative col-span-2 min-h-[15rem] overflow-hidden lg:col-span-1 lg:row-span-2`}
          >
            {profile.imageUrl ? (
              <>
                <Image
                  src={profile.imageUrl}
                  alt={`${profile.name} — profile photo`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
                />
              </>
            ) : (
              <div aria-hidden="true" className="absolute inset-0 thumb-placeholder" />
            )}
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-lg font-semibold tracking-tight">
                {profile.name}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {profile.role}
              </p>
            </div>
          </div>

          {/* Availability */}
          <SpotlightCard
            className={`${TILE} col-span-1`}
            contentClassName="flex h-full flex-col justify-between p-5"
          >
            <span className="relative flex size-2.5">
              {profile.available ? (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              ) : null}
              <span
                className={`relative inline-flex size-2.5 rounded-full ${
                  profile.available ? "bg-emerald-400" : "bg-muted-foreground"
                }`}
              />
            </span>
            <div>
              <p className="text-sm font-medium">
                {profile.available
                  ? profile.availabilityLabel || "Open to work"
                  : "Currently booked"}
              </p>
              <Link
                href="/contact"
                className="group mt-1 inline-flex items-center gap-1 font-mono text-xs text-primary"
              >
                Get in touch
                <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Location */}
          <SpotlightCard
            className={`${TILE} col-span-1`}
            contentClassName="flex h-full flex-col justify-between p-5"
          >
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                Based in
              </p>
              <p className="mt-1 text-sm font-medium text-balance">
                {profile.location || "Remote"}
              </p>
            </div>
          </SpotlightCard>

          {/* Stats */}
          {profile.stats.slice(0, 4).map((stat) => (
            <SpotlightCard
              key={stat.label}
              className={`${TILE} col-span-1`}
              contentClassName="flex h-full flex-col justify-center p-5 text-center"
            >
              <p className="text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">
                <CountUp value={stat.value} />
              </p>
              <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
                {stat.label}
              </p>
            </SpotlightCard>
          ))}

          {/* Tech marquee — full width */}
          {skills.length > 0 ? (
            <div
              className={`${TILE} col-span-2 flex items-center overflow-hidden lg:col-span-4`}
            >
              <Marquee
                className="w-full py-5"
                items={skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center gap-2 px-2 text-sm font-medium text-muted-foreground"
                  >
                    <span className="size-1.5 rounded-full bg-primary/70" />
                    {skill.name}
                  </span>
                ))}
              />
            </div>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
