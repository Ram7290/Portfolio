import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/admin");

  const { callbackUrl } = await searchParams;

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-semibold text-primary ring-1 ring-primary/25">
            RR
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your portfolio
          </p>
        </div>
        <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
      </div>
    </main>
  );
}
