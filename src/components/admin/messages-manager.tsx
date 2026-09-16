"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
import { deleteMessage, setMessageRead } from "@/actions/messages";
import { DeleteButton } from "@/components/admin/confirm-dialog";

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
}: {
  initial: MessageRow[];
  dbConfigured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [openMessage, setOpenMessage] = useState<MessageRow | null>(null);

  const unread = initial.filter((m) => !m.read).length;

  function toggleRead(message: MessageRow) {
    startTransition(async () => {
      const result = await setMessageRead(message.id, !message.read);
      if (result.ok) {
        router.refresh();
        if (openMessage?.id === message.id) {
          setOpenMessage({ ...openMessage, read: !message.read });
        }
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteMessage(id);
      if (result.ok) {
        toast.success("Message deleted.");
        setOpenMessage(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
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
