"use client";
import React from "react";
import SelectTemplateComponent from "./template/SelectTemplateComponent";
import { useAtom } from "jotai";
import { ChevronRight } from "lucide-react";
import ContentPurposeFlow from "./handler/purpose/ContentPurposeFlow";
import { flowPrevType, flowPromptId, flowSteps } from "~/atoms/flowAtom";
import XWBadge from "~/components/reusable/XWBadge";

const NewFlowManagerComponent = () => {
  const [step, setStep] = useAtom(flowSteps);
  const [flowPrompt, setFlowPromptId] = useAtom(flowPromptId);
  const [prev, setPrev] = useAtom(flowPrevType);

  return (
    <div>
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
            <h1 className="font-semibold">Select Template</h1>
          </div>
        </div>

        <div>
          <ChevronRight className="h-6 w-6" />
        </div>

        <div className="flex items-center gap-2 rounded-lg p-2">
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

      {step === 0 && <SelectTemplateComponent usecase="Content" />}

      {(step === 1 || step === 2) && flowPrompt && (
        <div className="mx-auto w-full max-w-4xl p-5 pb-10">
          <ContentPurposeFlow
            prev={prev || ""}
            inputType="text"
            promptId={flowPrompt}
            step={Number(step)}
            setStep={setStep}
          />
        </div>
      )}
    </div>
  );
};

export default NewFlowManagerComponent;
