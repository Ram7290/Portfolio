"use client";

import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  pending = false,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  pending?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {pending ? "Deleting…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteButton({
  title,
  description,
  onConfirm,
  pending,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  pending?: boolean;
}) {
  return (
    <ConfirmDialog
      title={title}
      description={description}
      onConfirm={onConfirm}
      pending={pending}
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      }
    />
  );
}
