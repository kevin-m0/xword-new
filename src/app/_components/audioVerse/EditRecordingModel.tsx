import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { XWInput } from "~/components/reusable/XWInput";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const EditRecordingModel = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size={"sm"} className="w-full justify-start">
            Edit Details
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-left text-2xl font-semibold">
              Edit Recording
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            <Separator />

            <div className="flex flex-col gap-2">
              <label htmlFor="title">Title</label>
              <XWInput id="title" placeholder="Enter recording title" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="language">Language</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="speakers">Number of Speakers</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of speakers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Speaker</SelectItem>
                  <SelectItem value="2">2 Speakers</SelectItem>
                  <SelectItem value="3">3 Speakers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-end gap-2">
              <DialogClose asChild>
                <XWSecondaryButton size="sm">Close</XWSecondaryButton>
              </DialogClose>
              <Button variant="default" size="sm">
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditRecordingModel;
