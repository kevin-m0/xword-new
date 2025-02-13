"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import NewAudioFlowManager from "./NewAudioFlowManager";
import { useAtom } from "jotai";
import { flowSteps } from "~/atoms/flowAtom";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

const NewAudioFlow = () => {
  const [step, setStep] = useAtom(flowSteps);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          onClick={() => setStep(0)}
          className="whitespace-nowrap rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-4 py-2 font-medium transition-opacity hover:opacity-90"
        >
          Create Content
        </Button>
      </DialogTrigger>
      <DialogContent className="xw-scrollbar bg-xw-sidebar max-h-[700px] w-full max-w-6xl overflow-y-auto rounded-2xl">
        <NewAudioFlowManager />
      </DialogContent>
    </Dialog>
  );
};

export default NewAudioFlow;
