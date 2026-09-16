"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </MotionConfig>
    </ThemeProvider>
  );
}
