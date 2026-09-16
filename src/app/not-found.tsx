import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist or has moved.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}
