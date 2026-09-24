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
  ExperienceDialogFields,
  type ExperienceDialogValues,
} from "@/components/admin/experience-fields";
import {
  experienceApi,
} from "@/lib/api-client";

export interface ExperienceRow {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  order: number;
}

export function ExperienceManager({
  initial,
  dbConfigured,
}: {
  initial: ExperienceRow[];
  dbConfigured: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<ExperienceRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleSave(values: ExperienceDialogValues) {
    setPending(true);
    try {
      const data = {
        ...values,
        order: editing?.order ?? initial.length + 1,
      };
      const result = editing?.id
        ? await experienceApi.update(editing.id, { ...data, id: editing.id })
        : await experienceApi.create(data);
      if (result.ok) {
        toast.success(editing ? "Experience updated." : "Experience added.");
        setDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Save failed.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: string) {
    setPending(true);
    try {
      const result = await experienceApi.delete(id);
      if (result.ok) {
        toast.success("Experience deleted.");
        router.refresh();
      } else {
        toast.error(result.error || "Delete failed.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setPending(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= initial.length) return;
    const ids = initial.map((s) => s.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setPending(true);
    try {
      const result = await experienceApi.reorder(ids);
      if (result.ok) router.refresh();
      else toast.error(result.error || "Reorder failed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setPending(false);
    }
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
          Add experience
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {initial.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No experience entries yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initial.map((exp, i) => (
                  <TableRow key={exp.id} className={pending ? "opacity-60" : ""}>
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
                    <TableCell className="font-medium">
                      {exp.role}
                      {exp.current ? (
                        <Badge className="ml-2 bg-primary/15 text-primary hover:bg-primary/15">
                          Current
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {exp.company}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {exp.startDate} — {exp.current ? "Present" : (exp.endDate ?? "—")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${exp.role}`}
                          onClick={() => {
                            setEditing(exp);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <DeleteButton
                          title="Delete experience?"
                          description={`“${exp.role} at ${exp.company}” will be permanently removed. This action cannot be undone.`}
                          onConfirm={() => handleDelete(exp.id)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit experience" : "Add experience"}
            </DialogTitle>
          </DialogHeader>
          <ExperienceDialogFields
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
