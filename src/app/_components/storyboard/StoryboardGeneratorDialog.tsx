import { Dialog, DialogContent } from "~/components/ui/dialog";
import React from "react";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import StoryboardGenerator from "./StoryboardGenerator";
import { DialogTitle } from "@radix-ui/react-dialog";

const StoryboardGeneratorDialog = () => {
  return (
    <Dialog open>
      <DialogContent className="max-h-[90vh] w-full max-w-7xl rounded-lg border border-xw-secondary bg-xw-sidebar p-0">
        <DialogTitle></DialogTitle>
        <ScrollArea className="h-[90vh] w-full">
          <div className="p-6">
            <StoryboardGenerator />
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default StoryboardGeneratorDialog;
