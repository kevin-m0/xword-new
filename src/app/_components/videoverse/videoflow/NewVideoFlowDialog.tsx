"use client";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import NewVideoFlowManager from "./NewVideoFlowManager";
import { useAtom } from "jotai";
import { flowSteps } from "~/atoms/flowAtom";

const NewVideoFlowDialog = () => {
  const [step, setStep] = useAtom(flowSteps);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          onClick={() => setStep(0)}
          className="h-full w-full whitespace-nowrap rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-6 py-2 font-medium transition-opacity hover:opacity-90"
        >
          Create Content
        </Button>
      </DialogTrigger>
      <DialogContent className="xw-scrollbar bg-xw-sidebar h-[700px] w-full max-w-6xl overflow-y-auto rounded-2xl">
        <NewVideoFlowManager />
      </DialogContent>
    </Dialog>
  );
};

export default NewVideoFlowDialog;
