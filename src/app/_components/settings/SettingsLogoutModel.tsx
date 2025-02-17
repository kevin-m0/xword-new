import React from "react";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";

const SettingsLogoutModel = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>Log out</Button>
      </DialogTrigger>
      <DialogContent className="bg-xw-sidebar">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold">
            Log out from all sessions?
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-center text-xw-muted">
          This will log you out on all devices where your account is currently
          signed in.
        </DialogDescription>
        <Separator />

        <div className="flex justify-between gap-2">
          <DialogClose>
            <XWSecondaryButton>Cancel</XWSecondaryButton>
          </DialogClose>
          <Button variant="destructive" size="sm">
            Log out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsLogoutModel;
