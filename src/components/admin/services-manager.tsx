"use client";

import { useState } from "react";
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
  ServiceDialogFields,
  type ServiceDialogValues,
  type ServiceRow,
} from "@/components/admin/service-fields";
import { servicesApi, type ApiResponse } from "@/lib/api-client";

export function ServicesManager({
  initial,
  dbConfigured,
  onChanged,
}: {
  initial: ServiceRow[];
  dbConfigured: boolean;
  onChanged: () => Promise<void> | void;
}) {
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
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

  async function handleSave(values: ServiceDialogValues) {
    const data = { ...values, order: editing?.order ?? initial.length + 1 };
    const saved = await run(
      editing
        ? servicesApi.update(editing.id, { ...data, id: editing.id })
        : servicesApi.create(data),
      editing ? "Service updated." : "Service added.",
    );
    if (saved) setDialogOpen(false);
  }

  function handleDelete(id: string) {
    void run(servicesApi.delete(id), "Service deleted.");
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= initial.length) return;
    const ids = initial.map((s) => s.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void run(servicesApi.reorder(ids));
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
          Add service
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {initial.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No services yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initial.map((service, i) => (
                  <TableRow key={service.id} className={pending ? "opacity-60" : ""}>
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
                    <TableCell className="max-w-72">
                      <p className="truncate font-medium">{service.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {service.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.icon}</Badge>
                    </TableCell>
                    <TableCell>
                      {service.active ? (
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
                          aria-label={`Edit ${service.title}`}
                          onClick={() => {
                            setEditing(service);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <DeleteButton
                          title="Delete service?"
                          description={`“${service.title}” will be permanently removed. This action cannot be undone.`}
                          onConfirm={() => handleDelete(service.id)}
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
            <DialogTitle>{editing ? "Edit service" : "Add service"}</DialogTitle>
          </DialogHeader>
          <ServiceDialogFields
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
