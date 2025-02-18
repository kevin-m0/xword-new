"use client";

import React, { useState } from "react";
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
import { XWInput } from "~/components/reusable/XWInput";

const SettingsDeactivateAccount = () => {
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Deactivate Account
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-xw-sidebar">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold">
            Deactivate Account?
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-center text-xw-muted">
          You won&apos;t be able to access your data, but you can log in anytime
          to reactivate your account.
        </DialogDescription>
        <Separator />

        {showPasswordConfirm ? (
          <>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Enter Password to Confirm
                </label>
                <XWInput type="password" placeholder="Enter your password" />
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <DialogClose>
                <XWSecondaryButton
                  onClick={() => setShowPasswordConfirm(false)}
                >
                  Cancel
                </XWSecondaryButton>
              </DialogClose>
              <Button variant="destructive" size="sm">
                Deactivate
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-between gap-2">
            <DialogClose>
              <XWSecondaryButton>Cancel</XWSecondaryButton>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowPasswordConfirm(true)}
            >
              Proceed
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDeactivateAccount;
