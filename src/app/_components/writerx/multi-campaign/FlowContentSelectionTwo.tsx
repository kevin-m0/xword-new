"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { ArrowRight, Loader, Loader2 } from "lucide-react";
import { useAtom } from "jotai";
import {
  multiFlowPrompt,
  multiFlowStep,
  multiFlowTranscribe,
  MultiSelectType,
  multiSourceSelect,
} from "~/atoms/multiFlow";
import WebUrlInput from "./sources/WebUrlInput";
import DocumentSelection from "./sources/DocumentSelection";
import { AudioInput, VideoInput } from "./sources/AudioInput";
import { handleFileTrasncription } from "../flow/handler/transcription/transcription";
import { useXWAlert } from "~/components/reusable/xw-alert";

const FlowContentSelectionTwo = () => {
  const [step, setStep] = useAtom(multiFlowStep);
  const [sourceType, setSourceType] = useAtom(multiSourceSelect);
  const [transcript, setTranscript] = useAtom(multiFlowPrompt);
  const [isTranscribing, setIsTranscribing] = useAtom(multiFlowTranscribe);
  const { showToast } = useXWAlert();

  const handleNext = async (url: string) => {
    setIsTranscribing(true);
    try {
      const isYoutubeUrl =
        url.includes("youtube.com") || url.includes("youtu.be");
      const res = await handleFileTrasncription({
        url,
        type: isYoutubeUrl ? "youtube" : "mux",
      });
      setTranscript(res.transcript);
    } catch (error) {
      showToast({
        title: "Failed",
        message: "Some error occurred! Please Try Again!",
        variant: "error",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const renderContent = () => {
    switch (sourceType) {
      case MultiSelectType.url:
        return <WebUrlInput />;
      case MultiSelectType.doc:
        return <DocumentSelection />;
      case MultiSelectType.audio:
      case MultiSelectType.audio_url:
        return <AudioInput onNext={handleNext} />;
      case MultiSelectType.video:
      case MultiSelectType.video_url:
        return <VideoInput onNext={handleNext} />;
      default:
        return null;
    }
  };
  return (
    <div className="space-y-4">
      {renderContent()}

      <div className="mt-2 flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setSourceType(MultiSelectType.default)}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={!transcript || isTranscribing}
          onClick={() => setStep(step + 1)}
        >
          {isTranscribing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Transcribing
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FlowContentSelectionTwo;
