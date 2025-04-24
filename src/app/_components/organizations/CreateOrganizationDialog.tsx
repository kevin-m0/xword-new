"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useOrganizationList } from "@clerk/nextjs";
import { useXWAlert } from "~/components/reusable/xw-alert";

const createOrgSchema = z.object({
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),
});

type CreateOrgFormData = z.infer<typeof createOrgSchema>;

interface CreateOrganizationDialogProps {
  afterCreate?: () => void;
  children?: React.ReactNode;
}
export function CreateOrganizationDialog({
  afterCreate,
  children,
}: CreateOrganizationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { createOrganization, userMemberships } = useOrganizationList();
  const { showToast } = useXWAlert();

  // react-hook-form + zod setup
  const form = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: { organizationName: "" },
  });
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: CreateOrgFormData) => {
    try {
      if (!createOrganization) return;
      await createOrganization({ name: data.organizationName });
      await userMemberships?.revalidate?.();

      showToast({
        title: "Organization created",
        message: `"${data.organizationName}" was created successfully!`,
        variant: "success",
      });

      reset();
      setOpen(false);
      afterCreate?.();
    } catch (error) {
      console.error(error);
      showToast({
        title: "Error",
        message: "Failed to create organization. Please try again later.",
        variant: "error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4" />
            New Workspace
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex justify-start">
            Create New Workspace
          </DialogTitle>
          <DialogDescription className="flex justify-start">
            Give your new workspace a unique name.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Organization name"
              {...register("organizationName")}
              disabled={isSubmitting}
            />
            {errors.organizationName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.organizationName.message}
              </p>
            )}
          </div>

          <div>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
