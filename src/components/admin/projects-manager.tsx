"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus, Star } from "lucide-react";
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
  ProjectDialogFields,
  type ProjectDialogValues,
} from "@/components/admin/project-fields";
import { deleteProject, reorderProjects, saveProject } from "@/actions/projects";

export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  problem: string | null;
  solution: string | null;
  features: string[];
  challenges: string | null;
  results: string | null;
  technologies: string[];
  category: string;
  thumbnailUrl: string | null;
  thumbnailPublicId?: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  order: number;
}

export function ProjectsManager({
  initial,
  dbConfigured,
}: {
  initial: ProjectRow[];
  dbConfigured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleSave(values: ProjectDialogValues) {
    startTransition(async () => {
      const result = await saveProject({
        id: editing?.id,
        ...values,
        order: editing?.order ?? initial.length + 1,
      });
      if (result.ok) {
        toast.success(editing ? "Project updated." : "Project added.");
        setDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteProject(id);
      if (result.ok) {
        toast.success("Project deleted.");
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
      const result = await reorderProjects(ids);
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
          Add project
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {initial.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No projects yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initial.map((project, i) => (
                  <TableRow key={project.id} className={pending ? "opacity-60" : ""}>
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
                    <TableCell className="max-w-56">
                      <p className="truncate font-medium">{project.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        /projects/{project.slug}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{project.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {project.featured ? (
                        <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15">
                          <Star className="size-3" />
                          Featured
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${project.title}`}
                          onClick={() => {
                            setEditing(project);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <DeleteButton
                          title="Delete project?"
                          description={`“${project.title}” will be permanently removed. This action cannot be undone.`}
                          onConfirm={() => handleDelete(project.id)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit project" : "Add project"}</DialogTitle>
          </DialogHeader>
          <ProjectDialogFields
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
