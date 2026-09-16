"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "@/actions/auth";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState<LoginState | null, FormData>(
    loginAction,
    null,
  );

  return (
    <Card className="border-border/60 bg-card/70 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-base">Sign in</CardTitle>
        <CardDescription>
          Use the credentials from your ADMIN_EMAIL / ADMIN_PASSWORD
          environment variables.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>
          {state?.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="mt-2">
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
