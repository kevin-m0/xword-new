"use client";

import React from "react";
import { useAtom } from "jotai";
import {
  multiFlowStep,
  MultiSelectType,
  multiSourceSelect,
} from "~/atoms/multiFlow";
import FlowContentSelection from "./FlowContentSelection";
import SourceSelectionComponent from "./SourceSelectionComponent";
import FlowContentSelectionTwo from "./FlowContentSelectionTwo";
import { ChevronRight } from "lucide-react";
import { Separator } from "~/components/ui/separator";

const MultiFlowOne = () => {
  const [step, setStep] = useAtom(multiFlowStep);
  const [sourceType, setSourceType] = useAtom(multiSourceSelect);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-5">
      <SourceSelectionComponent />

      <div>
        {sourceType !== MultiSelectType.default && (
          <div className="space-y-6">
            <Separator />
            <FlowContentSelectionTwo />
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiFlowOne;
