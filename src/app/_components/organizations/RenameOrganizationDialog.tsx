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
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Loader2 } from "lucide-react";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { OrganizationResource } from "@clerk/types";

const renameOrgSchema = z.object({
  newName: z
    .string()
    .nonempty("Organization name is required")
    .min(2, "Must be at least 2 characters"),
});

type RenameOrgFormData = z.infer<typeof renameOrgSchema>;

interface RenameOrganizationDialogProps {
  organization: OrganizationResource;
  onSuccess?: () => void;
}

export function RenameOrganizationDialog({
  organization,
  onSuccess,
}: RenameOrganizationDialogProps) {
  const { showToast } = useXWAlert();
  const [open, setOpen] = React.useState(false);

  const form = useForm<RenameOrgFormData>({
    resolver: zodResolver(renameOrgSchema),
    defaultValues: { newName: organization.name },
  });

  const {
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: RenameOrgFormData) => {
    // 1) Check if newName == existing org name
    const currentName = organization.name.trim().toLowerCase();
    const proposedName = data.newName.trim().toLowerCase();
    if (proposedName === currentName) {
      // Show an error within the form
      setError("newName", {
        message: "New name cannot be the same as the current name",
      });
      return;
    }

    try {
      // 2) Proceed with rename if different
      await organization.update({ name: data.newName });
      // await organization.revalidate?.()

      showToast({
        title: "Organization updated",
        message: `Organization renamed to "${data.newName}".`,
        variant: "success",
      });

      reset({ newName: data.newName }); // Update the form with the new name
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      showToast({
        title: "Error",
        message: "Could not rename organization. Please try again later.",
        variant: "error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Rename</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Organization</DialogTitle>
          <DialogDescription>
            Set a new name for your organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register("newName")} disabled={isSubmitting} />
            {errors.newName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newName.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
