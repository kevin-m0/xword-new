"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";

import NewFlowManagerComponent from "./NewFlowManagerComponent";
import { useAtom } from "jotai";
import { flowSteps } from "~/atoms/flowAtom";

const FlowDialog = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useAtom(flowSteps);
  return (
    <Dialog>
      <DialogTrigger onClick={() => setStep(0)} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="xw-scrollbar bg-xw-sidebar h-[700px] w-full max-w-6xl overflow-y-auto rounded-xl p-0">
        <NewFlowManagerComponent />
      </DialogContent>
    </Dialog>
  );
};

export default FlowDialog;
