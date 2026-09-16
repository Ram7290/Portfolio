"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Download, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  GitHubIcon,
  LinkedInIcon,
} from "@/components/public/brand-icons";
import { fadeUp } from "@/components/public/motion";
import type { Profile, SocialLinkItem } from "@/types/portfolio";

export function Hero({
  profile,
  socialLinks,
  resumeUrl,
}: {
  profile: Profile;
  socialLinks: SocialLinkItem[];
  resumeUrl: string;
}) {
  const reduceMotion = useReducedMotion();

  const item = (delay: number) => ({
    initial: reduceMotion ? false : ("hidden" as const),
    animate: "visible" as const,
    variants: fadeUp,
    transition: reduceMotion
      ? { duration: 0 }
      : { duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
  });

  const socialHrefs = {
    github: socialLinks.find((s) => s.platform === "GitHub")?.url,
    linkedin: socialLinks.find((s) => s.platform === "LinkedIn")?.url,
    email: socialLinks.find((s) => s.platform === "Email")?.url,
  };

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-14 sm:px-6 lg:px-8"
    >
      {/* Background: fine grid + radial glow + vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)] opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] glow-hero"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <motion.div
        {...item(0)}
        className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        {/* Profile picture */}
        {profile.imageUrl ? (
          <motion.div
            {...item(0)}
            className="relative mb-7 size-28 sm:size-32"
          >
            <div
              aria-hidden="true"
              className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary via-primary/30 to-transparent opacity-70 blur-[1px]"
            />
            <div className="relative size-full overflow-hidden rounded-full border border-border/60 bg-card shadow-2xl shadow-primary/10">
              <Image
                src={profile.imageUrl}
                alt={`${profile.name} — profile photo`}
                fill
                priority
                sizes="128px"
                className="object-cover"
              />
            </div>
          </motion.div>
        ) : null}

        {profile.available ? (
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availabilityLabel || "Open to Opportunities"}
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}

        <motion.h1
          {...item(0.1)}
          className="mt-7 text-4xl font-semibold tracking-tight text-balance sm:text-6xl"
        >
          {profile.name.split(" ").map((word, i, words) => (
            <span key={i}>
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.6,
                  delay: reduceMotion ? 0 : 0.15 + i * 0.09,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="inline-block"
              >
                {i === words.length - 1 ? (
                  <span className="text-gradient">{word}</span>
                ) : (
                  <>
                    {word}
                    {/* space between words */}
                    {" "}
                  </>
                )}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          {...item(0.35)}
          className="mt-5 font-mono text-sm tracking-wide text-primary sm:text-base"
        >
          {"// "}
          {profile.role}
        </motion.p>

        <motion.p
          {...item(0.45)}
          className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          {...item(0.55)}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="px-6">
            <Link href="/projects">
              View My Work
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          {resumeUrl ? (
            <Button asChild variant="outline" size="lg" className="px-6">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Download data-icon="inline-start" />
                Download Resume
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg" className="px-6">
              <Link href="/contact">
                <Mail data-icon="inline-start" />
                Contact Me
              </Link>
            </Button>
          )}
        </motion.div>

        <motion.ul
          {...item(0.65)}
          className="mt-9 flex items-center gap-3"
          aria-label="Social links"
        >
          {socialHrefs.github ? (
            <li>
              <a
                href={socialHrefs.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-card/40 text-muted-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                <GitHubIcon className="size-4.5" />
              </a>
            </li>
          ) : null}
          {socialHrefs.linkedin ? (
            <li>
              <a
                href={socialHrefs.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-card/40 text-muted-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                <LinkedInIcon className="size-4.5" />
              </a>
            </li>
          ) : null}
          {socialHrefs.email ? (
            <li>
              <a
                href={socialHrefs.email}
                aria-label="Send an email"
                className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-card/40 text-muted-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                <Mail className="size-4" />
              </a>
            </li>
          ) : null}
        </motion.ul>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        {...item(1)}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-muted-foreground/30 p-1.5">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 8, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="size-1 rounded-full bg-muted-foreground/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
