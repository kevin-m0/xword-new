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
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { Separator } from "~/components/ui/separator";
import { XWPassword } from "~/components/reusable/xw-password";

const SettingsChangePassword = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <XWSecondaryButton>Change Password</XWSecondaryButton>
      </DialogTrigger>
      <DialogContent className="bg-xw-sidebar">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold">
            Change Password
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <DialogDescription className="hidden text-xw-muted">
          Please enter your current password and choose a new password to update
          your credentials.
        </DialogDescription>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Current Password</label>
            <XWPassword placeholder="Enter your current password" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">New Password</label>
            <XWPassword placeholder="Enter your new password" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <XWPassword placeholder="Confirm your new password" />
          </div>
        </div>

        <Separator />

        <div className="flex justify-between gap-2">
          <DialogClose>
            <XWSecondaryButton>Cancel</XWSecondaryButton>
          </DialogClose>
          <Button variant="default" size="sm">
            Change
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsChangePassword;
