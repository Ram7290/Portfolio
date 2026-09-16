"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  type SkillRow,
  SkillDialogFields,
} from "@/components/admin/skill-fields";
import {
  deleteSkill,
  reorderSkills,
  saveSkill,
  toggleSkillActive,
} from "@/actions/skills";

export function SkillsManager({
  initial,
  dbConfigured,
}: {
  initial: SkillRow[];
  dbConfigured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<SkillRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(skill: SkillRow) {
    setEditing(skill);
    setDialogOpen(true);
  }

  function handleSave(values: SkillDialogFields) {
    startTransition(async () => {
      const result = await saveSkill({
        id: editing?.id,
        name: values.name,
        category: values.category,
        proficiency: values.proficiency,
        order: editing?.order ?? initial.length + 1,
        active: editing?.active ?? true,
      });
      if (result.ok) {
        toast.success(editing ? "Skill updated." : "Skill added.");
        setDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteSkill(id);
      if (result.ok) {
        toast.success("Skill deleted.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleToggle(id: string, active: boolean) {
    startTransition(async () => {
      const result = await toggleSkillActive(id, active);
      if (result.ok) router.refresh();
      else toast.error(result.error);
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= initial.length) return;
    const ids = initial.map((s) => s.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    startTransition(async () => {
      const result = await reorderSkills(ids);
      if (result.ok) router.refresh();
      else toast.error(result.error);
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate} disabled={!dbConfigured}>
          <Plus data-icon="inline-start" />
          Add skill
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {initial.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No skills yet. Connect the database and add your first skill.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Proficiency</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initial.map((skill, i) => (
                  <TableRow key={skill.id} className={pending ? "opacity-60" : ""}>
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
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{skill.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {skill.proficiency ?? "—"}
                    </TableCell>
                    <TableCell>
                      <button
                        role="switch"
                        aria-checked={skill.active}
                        aria-label={`Toggle ${skill.name} active`}
                        disabled={pending}
                        onClick={() => handleToggle(skill.id, !skill.active)}
                        className={`relative h-5 w-9 rounded-full transition-colors ${
                          skill.active ? "bg-primary" : "bg-input"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 size-4 rounded-full bg-background transition-all ${
                            skill.active ? "left-[18px]" : "left-0.5"
                          }`}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${skill.name}`}
                          onClick={() => openEdit(skill)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <DeleteButton
                          title="Delete skill?"
                          description={`“${skill.name}” will be permanently removed. This action cannot be undone.`}
                          onConfirm={() => handleDelete(skill.id)}
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
            <DialogTitle>{editing ? "Edit skill" : "Add skill"}</DialogTitle>
          </DialogHeader>
          <SkillDialogFields
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
