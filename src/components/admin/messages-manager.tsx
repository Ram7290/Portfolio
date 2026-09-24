"use client";

import { useState } from "react";
import { Eye, EyeOff, Inbox, MailOpen } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteButton } from "@/components/admin/confirm-dialog";
import { messagesApi } from "@/lib/api-client";

/** Window event fired whenever messages change, so the sidebar badge can refetch. */
export const MESSAGES_CHANGED_EVENT = "admin:messages-changed";

export interface MessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function MessagesManager({
  initial,
  dbConfigured,
  onChanged,
}: {
  initial: MessageRow[];
  dbConfigured: boolean;
  onChanged: () => Promise<void> | void;
}) {
  const [pending, setPending] = useState(false);
  const [openMessage, setOpenMessage] = useState<MessageRow | null>(null);

  const unread = initial.filter((m) => !m.read).length;

  async function afterChange() {
    window.dispatchEvent(new Event(MESSAGES_CHANGED_EVENT));
    await onChanged();
  }

  async function toggleRead(message: MessageRow) {
    // Update the open dialog right away (functional update: the dialog may
    // open in the same tick as this call, before `openMessage` re-renders).
    setOpenMessage((open) =>
      open?.id === message.id ? { ...open, read: !message.read } : open,
    );
    setPending(true);
    try {
      const result = await messagesApi.setRead(message.id, !message.read);
      if (result.ok) {
        await afterChange();
      } else {
        toast.error(result.error || "Update failed.");
        setOpenMessage((open) =>
          open?.id === message.id ? { ...open, read: message.read } : open,
        );
      }
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: string) {
    setPending(true);
    try {
      const result = await messagesApi.delete(id);
      if (result.ok) {
        toast.success("Message deleted.");
        setOpenMessage(null);
        await afterChange();
      } else {
        toast.error(result.error || "Delete failed.");
      }
    } finally {
      setPending(false);
    }
  }

  if (initial.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Inbox className="size-6 text-muted-foreground" />
          </span>
          <p className="font-medium">No messages yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {dbConfigured
              ? "When someone submits the contact form, their message will appear here."
              : "Connect the database to start receiving contact form messages."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {initial.length} message{initial.length === 1 ? "" : "s"} ·{" "}
        {unread} unread
      </p>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border/60">
            {initial.map((message) => (
              <li
                key={message.id}
                className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40 ${
                  pending ? "opacity-60" : ""
                } ${!message.read ? "bg-primary/[0.03]" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`size-2 shrink-0 rounded-full ${
                    message.read ? "bg-transparent" : "bg-primary"
                  }`}
                />
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => {
                    setOpenMessage(message);
                    if (!message.read) toggleRead(message);
                  }}
                >
                  <span className="flex items-baseline gap-2">
                    <span
                      className={`truncate text-sm ${
                        message.read
                          ? "text-muted-foreground"
                          : "font-medium text-foreground"
                      }`}
                    >
                      {message.subject}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {message.name} · {message.email}
                  </span>
                </button>
                <div className="flex shrink-0 gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={message.read ? "Mark as unread" : "Mark as read"}
                    disabled={pending}
                    onClick={() => toggleRead(message)}
                  >
                    {message.read ? (
                      <EyeOff className="size-3.5" />
                    ) : (
                      <MailOpen className="size-3.5" />
                    )}
                  </Button>
                  <DeleteButton
                    title="Delete message?"
                    description={`“${message.subject}” from ${message.name} will be permanently removed. This action cannot be undone.`}
                    onConfirm={() => handleDelete(message.id)}
                    pending={pending}
                  />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog
        open={openMessage !== null}
        onOpenChange={(open) => !open && setOpenMessage(null)}
      >
        <DialogContent className="sm:max-w-lg">
          {openMessage ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base">
                    {openMessage.subject}
                  </DialogTitle>
                  {!openMessage.read ? <Badge>Unread</Badge> : null}
                </div>
                <DialogDescription>
                  {openMessage.name} · {openMessage.email} ·{" "}
                  {new Date(openMessage.createdAt).toLocaleString("en-US")}
                </DialogDescription>
              </DialogHeader>
              <p className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed">
                {openMessage.message}
              </p>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  onClick={() => toggleRead(openMessage)}
                >
                  {openMessage.read ? (
                    <>
                      <EyeOff data-icon="inline-start" />
                      Mark unread
                    </>
                  ) : (
                    <>
                      <Eye data-icon="inline-start" />
                      Mark read
                    </>
                  )}
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <a href={`mailto:${openMessage.email}`}>Reply by email</a>
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
