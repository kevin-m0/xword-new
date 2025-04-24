import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { XWInput } from "~/components/reusable/XWInput";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { Separator } from "~/components/ui/separator";

const SettingsChangeEmail = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <XWSecondaryButton>Change Email</XWSecondaryButton>
      </DialogTrigger>
      <DialogContent className="bg-xw-sidebar">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold">
            Change Email
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <DialogDescription className="text-xw-muted">
          Please enter your new email address, and we&apos;ll send you a
          verification link to confirm the change.
        </DialogDescription>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">New Email Address</label>
            <XWInput placeholder="Enter your new Email address" />
          </div>
        </div>

        <Separator />

        <div className="flex justify-between gap-2">
          <DialogClose>
            <XWSecondaryButton>Cancel</XWSecondaryButton>
          </DialogClose>
          <Button variant="default" size="sm">
            Send Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsChangeEmail;
