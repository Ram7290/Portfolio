"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const TYPE_MS = 110; // per-character typing speed
const DELETE_MS = 55; // per-character deleting speed
const HOLD_MS = 1800; // pause once fully typed
const START_MS = 400; // pause before retyping

type Phase = "typing" | "holding" | "deleting";

/**
 * Renders `name` with a live typewriter effect: types out, pauses, deletes,
 * and loops. The last word keeps the gradient accent. Falls back to the full
 * static name when the visitor prefers reduced motion.
 */
export function TypewriterName({ name }: { name: string }) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? name.length : 0);
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    if (reduceMotion) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (count < name.length) {
        timeout = setTimeout(() => setCount((c) => c + 1), TYPE_MS);
      } else {
        timeout = setTimeout(() => setPhase("holding"), HOLD_MS);
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 0);
    } else {
      // deleting
      if (count > 0) {
        timeout = setTimeout(() => setCount((c) => c - 1), DELETE_MS);
      } else {
        timeout = setTimeout(() => setPhase("typing"), START_MS);
      }
    }

    return () => clearTimeout(timeout);
  }, [count, phase, name, reduceMotion]);

  // Split so the last word can keep the gradient accent.
  const lastSpace = name.lastIndexOf(" ");
  const firstPartLen = lastSpace === -1 ? 0 : lastSpace + 1;

  const shown = name.slice(0, count);
  const firstShown = shown.slice(0, Math.min(count, firstPartLen));
  const lastShown = count > firstPartLen ? shown.slice(firstPartLen) : "";

  return (
    <span aria-label={name}>
      <span aria-hidden="true">
        {firstShown}
        {lastShown ? <span className="text-gradient">{lastShown}</span> : null}
        {!reduceMotion ? (
          <span className="ml-1 inline-block h-[0.82em] w-[0.06em] translate-y-[0.06em] animate-caret-blink rounded-full bg-primary align-baseline" />
        ) : null}
      </span>
    </span>
  );
}
