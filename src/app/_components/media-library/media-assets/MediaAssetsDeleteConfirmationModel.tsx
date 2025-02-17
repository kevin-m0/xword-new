"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useXWAlert } from "~/components/reusable/xw-alert";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { trpc } from "~/trpc/react";

const MediaAssetsDeleteConfirmationModel = ({
  id,
  type,
}: {
  id: string;
  type: "image" | "audio";
}) => {
  const [open, setOpen] = React.useState(false);
  const { showToast } = useXWAlert();
  const utils = trpc.useUtils();

  const deleteImage = trpc.assets.deleteMediaAsset.useMutation({
    onSuccess: () => {
      setOpen(false);
      // console.log(`Asset with ID ${id} deleted successfully.`);

      // revalidatePath("/media");
      utils.assets.getAllMediaAssets.invalidate();
      return showToast({
        title: "Deleted!",
        message: "Asset deleted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      console.error("Error deleting asset:", error.message);
      return showToast({
        title: "Error",
        message: error.message,
        variant: "error",
      });
    },
  });

  const deleteAudio = trpc.assets.deleteMediaAudioAsset.useMutation({
    onSuccess: () => {
      setOpen(false);
      // console.log(`Asset with ID ${id} deleted successfully.`);

      // revalidatePath("/media");
      utils.assets.getAllMediaAssets.invalidate();
      return showToast({
        title: "Deleted!",
        message: "Asset deleted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      console.error("Error deleting asset:", error.message);
      return showToast({
        title: "Error",
        message: error.message,
        variant: "error",
      });
    },
  });

  const handleDelete = () => {
    if (type === "image") {
      deleteImage.mutate({ id });
    } else {
      deleteAudio.mutate({ id });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size={"sm"} className="w-full justify-start">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-xw-sidebar sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl">Delete {id}?</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this file. It cannot be recovered
            once deleted.
          </p>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="flex justify-between gap-2">
          <XWSecondaryButton onClick={() => setOpen(false)}>
            Cancel
          </XWSecondaryButton>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            {deleteImage.isPending || deleteAudio.isPending
              ? "Deleting..."
              : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaAssetsDeleteConfirmationModel;
