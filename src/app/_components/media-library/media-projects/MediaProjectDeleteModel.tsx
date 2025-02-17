"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/reusable/xw-dialog";
import { Button } from "~/components/ui/button";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { trpc } from "~/trpc/react";

interface IMediaProjectDeleteModelProps {
  id: string;
  type: "audio" | "video" | "docs";
}

const MediaProjectDeleteModel = ({
  id,
  type,
}: IMediaProjectDeleteModelProps) => {
  const [open, setOpen] = useState(false);
  const { showToast } = useXWAlert();

  const utils = trpc.useUtils();

  const handleClose = () => {
    setOpen(false);
  };

  // delete audio
  const deleteAudio = trpc.assets.deleteProjectAudio.useMutation({
    onSuccess: () => {
      utils.assets.getProjectAudioDocs.invalidate();
      handleClose();
      showToast({
        title: "Deleted",
        message: "Audio deleted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        title: "Error",
        message: error.message,
        variant: "error",
      });
    },
  });

  // delete video
  const deleteVideo = trpc.assets.deleteProjectVideo.useMutation({
    onSuccess: () => {
      utils.assets.getProjectVideos.invalidate();
      handleClose();
      showToast({
        title: "Deleted",
        message: "Video deleted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        title: "Error",
        message: error.message,
        variant: "error",
      });
    },
  });

  // delete docs
  const deleteDocs = trpc.assets.deleteProjectDocument.useMutation({
    onSuccess: () => {
      utils.assets.getProjectDocuments.invalidate();
      handleClose();
      showToast({
        title: "Deleted",
        message: "Docs deleted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        title: "Error",
        message: error.message,
        variant: "error",
      });
    },
  });

  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    if (type === "audio") {
      deleteAudio.mutate(
        { audioProjectId: id },
        {
          onSettled: () => setLoading(false),
        },
      );
    } else if (type === "video") {
      deleteVideo.mutate(
        { videoId: id },
        {
          onSettled: () => setLoading(false),
        },
      );
    } else {
      deleteDocs.mutate(
        { documentId: id },
        {
          onSettled: () => setLoading(false),
        },
      );
    }
    setLoading(true);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size={"sm"} className="w-full justify-start">
            Delete
          </Button>
        </DialogTrigger>

        <DialogContent className="flex flex-col gap-5 bg-xw-sidebar sm:max-w-[425px]">
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl">Delete Project?</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this project. It cannot be
              recovered once deleted.
            </p>
          </DialogHeader>

          <XWGradSeparator />

          <div className="flex justify-between gap-2">
            <XWSecondaryButton size="sm" onClick={handleClose}>
              Cancel
            </XWSecondaryButton>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaProjectDeleteModel;
