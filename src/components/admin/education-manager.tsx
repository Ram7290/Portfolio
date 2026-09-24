"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

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
  EducationDialogFields,
  type EducationDialogValues,
  type EducationRow,
} from "@/components/admin/education-fields";
import { educationApi, type ApiResponse } from "@/lib/api-client";

export function EducationManager({
  initial,
  dbConfigured,
  onChanged,
}: {
  initial: EducationRow[];
  dbConfigured: boolean;
  onChanged: () => Promise<void> | void;
}) {
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<EducationRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function run(request: Promise<ApiResponse<unknown>>, successMessage?: string) {
    setPending(true);
    try {
      const result = await request;
      if (!result.ok) {
        toast.error(result.error || "Request failed.");
        return false;
      }
      if (successMessage) toast.success(successMessage);
      await onChanged();
      return true;
    } finally {
      setPending(false);
    }
  }

  async function handleSave(values: EducationDialogValues) {
    const data = { ...values, order: editing?.order ?? initial.length + 1 };
    const saved = await run(
      editing
        ? educationApi.update(editing.id, { ...data, id: editing.id })
        : educationApi.create(data),
      editing ? "Education updated." : "Education added.",
    );
    if (saved) setDialogOpen(false);
  }

  function handleDelete(id: string) {
    void run(educationApi.delete(id), "Education deleted.");
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= initial.length) return;
    const ids = initial.map((s) => s.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void run(educationApi.reorder(ids));
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
          Add education
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {initial.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No education entries yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Years</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initial.map((edu, i) => (
                  <TableRow key={edu.id} className={pending ? "opacity-60" : ""}>
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
                    <TableCell className="font-medium">{edu.degree}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {edu.institution}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {edu.startYear} — {edu.endYear ?? "Present"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${edu.degree}`}
                          onClick={() => {
                            setEditing(edu);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <DeleteButton
                          title="Delete education?"
                          description={`“${edu.degree} at ${edu.institution}” will be permanently removed. This action cannot be undone.`}
                          onConfirm={() => handleDelete(edu.id)}
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
            <DialogTitle>{editing ? "Edit education" : "Add education"}</DialogTitle>
          </DialogHeader>
          <EducationDialogFields
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
