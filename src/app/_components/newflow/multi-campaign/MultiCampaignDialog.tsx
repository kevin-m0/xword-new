"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { useAtom } from "jotai";
import {
  multiFlowStep,
  MultiSelectType,
  multiSourceSelect,
} from "~/atoms/multiFlow";
import MultiFlowOne from "./MultiFlowOne";
import MultiFlowTwo from "./MultiFlowTwo";
import MultiFlowThree from "./MultiFlowThree";
import XWBadge from "~/components/reusable/XWBadge";
import { ChevronRight } from "lucide-react";

const MultiCampaignDialog = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useAtom(multiFlowStep);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [source, setSource] = useAtom(multiSourceSelect);

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleOpen = () => {
    setDialogOpen(true);
    setStep(0);
    setSource(MultiSelectType.default);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger onClick={handleOpen} asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="bg-xw-sidebar flex h-[700px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl p-0">
        <div className="flex items-center gap-2 p-5">
          <div
            className="hover:bg-xw-secondary flex cursor-pointer items-center gap-4 rounded-lg p-2"
            onClick={() => setStep(0)}
          >
            <XWBadge
              className={`h-8 w-8 rounded-full ${step === 0 ? "bg-xw-primary" : "bg-xw-primary-disabled"} `}
            >
              1
            </XWBadge>
            <div>
              <h1 className="font-semibold">Select Source</h1>
            </div>
          </div>

          <div>
            <ChevronRight className="h-6 w-6" />
          </div>

          <div
            className="hover:bg-xw-secondary flex cursor-pointer items-center gap-2 rounded-lg p-2"
            onClick={handleBack}
          >
            <XWBadge
              className={`h-8 w-8 rounded-full ${step === 1 ? "bg-xw-primary" : "bg-xw-primary-disabled"} `}
            >
              2
            </XWBadge>
            <div>
              <h1 className="font-semibold">Provide Context</h1>
            </div>
          </div>

          <div>
            <ChevronRight className="h-6 w-6" />
          </div>

          <div className="flex items-center gap-2 rounded-lg p-2">
            <XWBadge
              className={`h-8 w-8 rounded-full ${step === 2 ? "bg-xw-primary" : "bg-xw-primary-disabled"} `}
            >
              3
            </XWBadge>
            <div>
              <h1 className="font-semibold">Generate Content</h1>
            </div>
          </div>
        </div>
        <div className="xw-scrollbar flex-1 overflow-y-auto p-5 pb-10">
          {step === 0 ? (
            <MultiFlowOne />
          ) : step === 1 ? (
            <MultiFlowTwo />
          ) : step === 2 ? (
            <MultiFlowThree closeDialog={() => setDialogOpen(false)} />
          ) : (
            <></>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiCampaignDialog;
