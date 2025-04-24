"use client";

import React from "react";
import { DialogHeader } from "~/components/reusable/xw-dialog";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";

const DeleteRecordingModel = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size={"sm"} className="w-full justify-start">
          Delete Recording
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-xw-sidebar sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl">
            Delete Recording Video_clip_2024-09-18.mp4?
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this recording. It cannot be
            recovered once deleted.
          </p>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="flex justify-between gap-2">
          <XWSecondaryButton onClick={() => setOpen(false)}>
            Cancel
          </XWSecondaryButton>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRecordingModel;
