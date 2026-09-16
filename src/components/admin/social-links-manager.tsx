"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/confirm-dialog";
import {
  SocialLinkDialogFields,
  type SocialLinkDialogValues,
  type SocialLinkRow,
} from "@/components/admin/social-link-fields";
import {
  deleteSocialLink,
  reorderSocialLinks,
  saveSocialLink,
} from "@/actions/settings";

export function SocialLinksManager({
  initial,
  dbConfigured,
}: {
  initial: SocialLinkRow[];
  dbConfigured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<SocialLinkRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleSave(values: SocialLinkDialogValues) {
    startTransition(async () => {
      const result = await saveSocialLink({
        id: editing?.id,
        ...values,
        order: editing?.order ?? initial.length + 1,
      });
      if (result.ok) {
        toast.success(editing ? "Link updated." : "Link added.");
        setDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteSocialLink(id);
      if (result.ok) {
        toast.success("Link deleted.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= initial.length) return;
    const ids = initial.map((s) => s.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    startTransition(async () => {
      const result = await reorderSocialLinks(ids);
      if (result.ok) router.refresh();
      else toast.error(result.error);
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          disabled={!dbConfigured}
        >
          <Plus data-icon="inline-start" />
          Add link
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {initial.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No social links yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initial.map((link, i) => (
                  <TableRow key={link.id} className={pending ? "opacity-60" : ""}>
                    <TableCell>
                      <div className="flex gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Move up"
                          disabled={i === 0 || pending}
                          onClick={() => move(i, -1)}
                        >
                          <ChevronUp className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Move down"
                          disabled={i === initial.length - 1 || pending}
                          onClick={() => move(i, 1)}
                        >
                          <ChevronDown className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{link.platform}</TableCell>
                    <TableCell className="max-w-64">
                      <p className="truncate text-xs text-muted-foreground">
                        {link.url}
                      </p>
                    </TableCell>
                    <TableCell>
                      {link.active ? (
                        <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Hidden</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${link.platform}`}
                          onClick={() => {
                            setEditing(link);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <DeleteButton
                          title="Delete link?"
                          description={`“${link.platform}” will be permanently removed. This action cannot be undone.`}
                          onConfirm={() => handleDelete(link.id)}
                          pending={pending}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit link" : "Add link"}</DialogTitle>
          </DialogHeader>
          <SocialLinkDialogFields
            initial={editing}
            onSubmit={handleSave}
            onCancel={() => setDialogOpen(false)}
            pending={pending}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
