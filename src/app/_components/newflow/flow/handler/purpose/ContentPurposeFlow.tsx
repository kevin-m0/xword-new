import React from "react";
import { DynamicForm } from "../../support/DynamicForm";
import FlowInitialSkeleton from "../skeletons/FlowInitialSkeleton";
import { trpc } from "~/trpc/react";

const ContentPurposeFlow = ({
  promptId,
  inputType,
  prev,
  step,
  setStep,
}: {
  prev: string;
  promptId: string;
  inputType: string;
  step: Number;
  setStep: (num: Number) => void;
}) => {
  const { data: prompt, isLoading } = trpc.flow.fetchSinglePrompt.useQuery({
    id: promptId,
  });

  if (!isLoading) console.log("Single Prompt: ", prompt);

  return (
    <div className="mt-5">
      {/* <div>promptId: {promptId}</div> */}
      {isLoading && <FlowInitialSkeleton />}
      {!isLoading && (
        <div className="mt-2">
          <DynamicForm
            {...prompt}
            inputType={inputType}
            prev={prev}
            step={step}
            setStep={setStep}
          />
        </div>
      )}
    </div>
  );
};

export default ContentPurposeFlow;
