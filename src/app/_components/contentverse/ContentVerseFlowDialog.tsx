import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import React from "react";
import NewFlowManagerComponent from "../newflow/flow/NewFlowManagerComponent";

const ContentVerseFlowDialog = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "text" | "audio" | "video";
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="xw-scrollbar bg-xw-sidebar h-[700px] w-full max-w-6xl overflow-y-auto rounded-xl p-0">
        <NewFlowManagerComponent />
      </DialogContent>
    </Dialog>
  );
};

export default ContentVerseFlowDialog;
