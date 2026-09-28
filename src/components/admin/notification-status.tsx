"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApiResource } from "@/hooks/use-api-resource";
import {
  notificationsApi,
  type NotificationChannel,
} from "@/lib/api-client";

const LABELS: Record<NotificationChannel, string> = {
  telegram: "Telegram",
  email: "Email",
  whatsapp: "WhatsApp",
};

/** Shows which phone-alert channels are configured and sends a test alert. */
export function NotificationStatus() {
  const { data, loading } = useApiResource<Record<NotificationChannel, boolean> | null>(
    notificationsApi.status,
    null,
  );
  const [pending, setPending] = useState(false);

  if (loading || !data) return null;

  const channels = Object.keys(LABELS) as NotificationChannel[];
  const anyConfigured = channels.some((c) => data[c]);

  async function sendTest() {
    setPending(true);
    try {
      const result = await notificationsApi.test();
      if (!result.ok) {
        toast.error(result.error || "Test failed.");
        return;
      }
      for (const r of result.data ?? []) {
        if (r.status === "sent") toast.success(`${LABELS[r.channel]}: test alert sent.`);
        if (r.status === "failed") {
          toast.error(`${LABELS[r.channel]} failed`, { description: r.error });
        }
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="flex flex-wrap items-center gap-3 p-4">
        <BellRing className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm font-medium">Phone alerts</span>
        <div className="flex flex-wrap gap-1.5">
          {channels.map((c) => (
            <Badge key={c} variant={data[c] ? "default" : "outline"}>
              {LABELS[c]} {data[c] ? "on" : "off"}
            </Badge>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          disabled={!anyConfigured || pending}
          onClick={sendTest}
        >
          {pending ? "Sending…" : "Send test alert"}
        </Button>
        {!anyConfigured ? (
          <p className="w-full text-xs text-muted-foreground">
            Add TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID or RESEND_API_KEY + NOTIFY_EMAIL_TO
            to your environment to get alerts on your phone.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
