"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Check } from "lucide-react";
import ScriptEditor from "./ScriptEditor";
import StoryboardStyleSelector from "./StoryboardStyleSelector";
import { audioVerseHeader } from "~/lib/constant/flow.constants";

const StoryboardGenerator = ({}: {}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const storyboardHeader = ["Script", "Style"];

  const incrementStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
    setCompletedSteps((prevSteps) => [...prevSteps, prevSteps.length + 1]);
  };

  const handleStepClick = (stepNumber: number) => {
    // Allow clicking on completed steps or the next available step
    if (
      completedSteps.includes(stepNumber) ||
      stepNumber === currentStep + 1 ||
      stepNumber === currentStep
    ) {
      if (stepNumber < currentStep) {
        // Going backwards - update completed steps
        setCompletedSteps((prev) => prev.filter((step) => step < stepNumber));
      } else if (stepNumber > currentStep) {
        // Going forwards - mark previous step as completed
        setCompletedSteps((prev) =>
          Array.from(new Set([...prev, currentStep])),
        );
      }
      setCurrentStep(stepNumber);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setCompletedSteps((prev) =>
        prev.filter((step) => step < currentStep - 1),
      );
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ScriptEditor goForward={handleNextStep} />;
      case 2:
        return <StoryboardStyleSelector handleNextStep={handleNextStep} />;
      default:
        return <ScriptEditor goForward={handleNextStep} />;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
      <div className="flex items-center gap-3 p-4">
        {storyboardHeader.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = stepNumber === currentStep;
          const isClickable =
            isCompleted ||
            stepNumber === currentStep ||
            stepNumber === currentStep + 1;

          return (
            <div
              key={index}
              className={`flex items-center gap-4 ${isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              onClick={() => isClickable && handleStepClick(stepNumber)}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ${
                  isCompleted
                    ? "bg-green-500"
                    : isCurrent
                      ? "bg-xw-primary"
                      : "border border-xw-secondary bg-xw-background text-xw-muted"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-6 w-6 text-white" />
                ) : (
                  stepNumber
                )}
              </div>
              <h1
                className={`transition-colors duration-200 ${!isCurrent && !isCompleted ? "text-xw-muted" : ""}`}
              >
                {step}
              </h1>
              {index !== audioVerseHeader.length - 1 && (
                <ChevronRight
                  className={`h-6 w-6 transition-colors duration-200 ${!isCurrent && !isCompleted ? "text-xw-muted" : ""}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {renderStep()}
    </div>
  );
};

export default StoryboardGenerator;
