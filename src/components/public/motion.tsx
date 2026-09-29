"use client";

import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
  animate,
  type Variants,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from "react";

/**
 * Shared motion helpers so animations stay consistent and subtle.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      variants={fadeUp}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }
      }
    >
      {children}
    </MotionTag>
  );
}

/**
 * A card that follows the cursor with a soft radial spotlight and lifts
 * slightly on hover. Falls back to a static card for reduced-motion users.
 */
export function SpotlightCard({
  children,
  className = "",
  contentClassName = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <MotionTag
      ref={ref as unknown as Ref<HTMLDivElement>}
      onPointerMove={reduceMotion ? undefined : onPointerMove}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`group/spot relative overflow-hidden ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 spotlight-glow opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
      />
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </MotionTag>
  );
}

/**
 * Counts from 0 up to `value` when scrolled into view. Preserves any
 * non-numeric prefix/suffix (e.g. "5+", "~20", "99%").
 */
export function CountUp({
  value,
  className,
  duration = 1.4,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  const match = value.match(/-?[\d.,]+/);
  const numStr = match ? match[0] : "";
  const target = match ? parseFloat(numStr.replace(/,/g, "")) : NaN;
  const hasNumber = !Number.isNaN(target);
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

  const [display, setDisplay] = useState(
    hasNumber && !reduceMotion ? value.replace(numStr, "0") : value,
  );

  useEffect(() => {
    if (!inView || !hasNumber || reduceMotion) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (latest) => {
        setDisplay(value.replace(numStr, latest.toFixed(decimals)));
      },
    });
    return () => controls.stop();
  }, [inView, hasNumber, reduceMotion, target, value, duration, decimals, numStr]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/**
 * Wraps a button/link so it drifts toward the cursor (magnetic effect).
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Infinite, seamless horizontal marquee. Pauses on hover.
 */
export function Marquee({
  items,
  className = "",
}: {
  items: ReactNode[];
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}
    >
      <div className="marquee-track gap-3 group-hover:[animation-play-state:paused]">
        {[0, 1].map((dup) => (
          <ul
            key={dup}
            aria-hidden={dup === 1}
            className="flex shrink-0 items-center gap-3 pr-3"
          >
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-xs font-medium tracking-[0.2em] text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

/**
 * Editorial, left-aligned section header: index number + hairline rule,
 * eyebrow, an oversized title, and an optional action on the right.
 */
export function EditorialHeader({
  number,
  eyebrow,
  title,
  description,
  action,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Reveal>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-8 lg:gap-10">
          <div className="flex items-center gap-3 md:pt-2">
            <span className="font-mono text-sm font-medium text-primary">
              {number}
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-primary/60 to-transparent" />
          </div>
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
              {title}
            </h2>
            {description ? (
              <p className="mt-4 max-w-xl text-muted-foreground text-pretty">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Reveal>
  );
}

/**
 * Fixed vertical section index with scroll-spy. Desktop (xl) only.
 */
export function SectionIndex({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex flex-col items-end gap-3.5">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group flex items-center justify-end gap-2.5"
              >
                <span
                  className={`font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${
                    isActive
                      ? "text-foreground opacity-100"
                      : "translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`h-px transition-all duration-300 ${
                    isActive
                      ? "w-8 bg-primary"
                      : "w-4 bg-muted-foreground/40 group-hover:w-6 group-hover:bg-foreground"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
