"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MESSAGE_RECEIVED_EVENT } from "@/lib/admin-events";

interface IncomingMessage {
  id: string;
  name: string;
  subject: string;
}

/**
 * Subscribes to /api/messages/stream for the whole admin session: shows a
 * toast the moment a visitor sends a message and tells the inbox and the
 * unread badge to refresh. Renders nothing.
 */
export function LiveMessages() {
  const router = useRouter();

  useEffect(() => {
    const source = new EventSource("/api/messages/stream");
    let connectedBefore = false;

    source.addEventListener("open", () => {
      // After a reconnect, resync in case a message landed during the gap.
      if (connectedBefore) window.dispatchEvent(new Event(MESSAGE_RECEIVED_EVENT));
      connectedBefore = true;
    });

    source.addEventListener("new-message", (event) => {
      const message = JSON.parse((event as MessageEvent<string>).data) as IncomingMessage;
      window.dispatchEvent(new Event(MESSAGE_RECEIVED_EVENT));
      toast.info(`New message from ${message.name}`, {
        description: message.subject,
        action: {
          label: "View",
          onClick: () => router.push("/admin/messages"),
        },
      });
    });

    return () => source.close();
  }, [router]);

  return null;
}
