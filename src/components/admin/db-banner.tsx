import { Database } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DbBanner({ configured }: { configured: boolean }) {
  if (configured) return null;
  return (
    <Alert className="mb-8 border-primary/30 bg-primary/5">
      <Database className="size-4 text-primary" />
      <AlertTitle>Database not connected</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        Set <code className="rounded bg-muted px-1 py-0.5 text-xs">MONGODB_URI</code>{" "}
        in <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>{" "}
        and run <code className="rounded bg-muted px-1 py-0.5 text-xs">npm run seed</code>{" "}
        to enable editing. The public site is using placeholder data meanwhile.
      </AlertDescription>
    </Alert>
  );
}
