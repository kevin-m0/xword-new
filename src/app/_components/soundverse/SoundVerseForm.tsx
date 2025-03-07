"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { audioVoiceStyleIdAtom, audioVoiceStyleNameAtom, generatedAudioKeyAtom, isCheckingGrammarAtom, isGeneratingScriptAtom, isGeneratingTransScriptAtom, isProcessingAtom, isUploadingAtom, localFileAtom, paraTextAtom, selectedLanguageAtom, transcriptAtom, transcriptionErrorAtom } from "~/atoms/soundVerseAtom";
import { useAtom } from "jotai";
import { SpeedOptions } from "@prisma/client";
import { CreateUserVoice } from "./CreateUserVoice";
import SelectLanguage from "./SelectLanguage";
import UserVoices from "./UserVoices";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useXWAlert } from "~/components/reusable/xw-alert";
// import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import { trpc } from "~/trpc/react";
import { useGenerationHelpers } from "~/hooks/soundverse/useGenerationHelpers";
import XWTabs from "~/components/reusable/XWTabs";
import TextToSpeech from "./TextToSpeech";
import SpeechToSpeech from "./SpeechToSpeech";
import SystemVoices from "./SystemVoices";
import { VoiceSpeedSelector } from "./SoundVerseSpeedSelector";
import { cleanScriptForTTS } from "~/utils/utils";

type TabType = "text" | "speech";
type VoiceTabType = "system" | "user";

export default function SoundVerseForm({
  refetchGeneratedAudios,
}: {
  refetchGeneratedAudios: () => void;
}) {

  const [speed, setSpeed] = useState<SpeedOptions>("normal");
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [activeTabVoiceType, setActiveTabVoiceType] = useState<VoiceTabType>("system");

  const [voiceStyleId, setVoiceStyleId] = useAtom(audioVoiceStyleIdAtom);
  const [voiceStyleName, setVoiceStyleName] = useAtom(audioVoiceStyleNameAtom);
  const [paraText, setParaText] = useAtom(paraTextAtom);
  const [isProcessing, setIsProcessing] = useAtom(isProcessingAtom);
  const [localFile, setLocalFile] = useAtom(localFileAtom);
  const [isUploading, setIsUploading] = useAtom(isUploadingAtom);
  const [isGeneratingTransScript, setIsGeneratingTransScript] = useAtom(isGeneratingTransScriptAtom);
  const [transcriptionError, setTranscriptionError] = useAtom(transcriptionErrorAtom);
  const [generatedAudioKey, setGeneratedAudioKey] = useAtom(generatedAudioKeyAtom);
  const [transcript, setTranscript] = useAtom(transcriptAtom);
  const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);

  const { user } = useUser();
  const { showToast } = useXWAlert();
  const { generateVoice } = useGenerationHelpers();
  const {organization : defaultSpace} = useOrganization();

  const { mutateAsync: createAudioModel } = trpc.audio.createAudioModel.useMutation();

  //  * Reset states (including error state).
  const handleReset = () => {
    setParaText("");
    setTranscript("");
    setVoiceStyleId(null);
    setVoiceStyleName("");
    setGeneratedAudioKey(null);
    setLocalFile(null);
    setTranscriptionError(false); // <--- NEW
  };

  //  * Speech-to-Speech generation flow
  const handleGenerateSpeechToSpeech = async () => {
    try {
      setIsProcessing(true);
      if (!voiceStyleId) {
        showToast({
          title: "Error",
          message: "Please select a voice style.",
          variant: "error",
        });
        return;
      }
      if (!transcript) {
        showToast({
          title: "Error",
          message: "No transcript available. Please transcribe first.",
          variant: "error",
        });
        return;
      }

      const payload = {
        transcript,
        voiceId: voiceStyleId,
        speed,
        userId: user?.id || "",
        language: selectedLanguage,
      };

      // Generate voice
      const fileKey = await generateVoice(payload);
      if (fileKey) {
        const audioModel = {
          text: transcript,
          audioKey: fileKey,
          workspaceId: defaultSpace?.id || "",
          persona: voiceStyleName || "Unknown Persona",
          personaId: voiceStyleId || "default-persona-id",
        };

        createAudioModel(audioModel, {
          onSuccess: async () => {
            showToast({
              title: "Success",
              message: "Audio generated successfully",
              variant: "success",
            });
            // Force re-fetch audios
            await refetchGeneratedAudios(); // <--- ensure it awaits
            // Reset
            handleReset();
          },
          onError: (error) => {
            console.error("Failed to create audio model:", error.message);
            showToast({
              title: "Error",
              message: "Failed to save audio",
              variant: "error",
            });
          },
        });
      } else {
        showToast({
          title: "Error",
          message: "Failed to generate audio, Please try again",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      showToast({
        title: "Error",
        message: "Failed to generate audio, Please try again",
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  //  * Text-to-Speech generation flow
  const handleGenerateTextToSpeech = async () => {
    try {
      setIsProcessing(true);
      if (!voiceStyleId) {
        showToast({
          title: "Error",
          message: "Please select a voice style",
          variant: "error",
        });
        return;
      }

      const sanitizeText = cleanScriptForTTS(paraText);
      const payload = {
        transcript: sanitizeText,
        voiceId: voiceStyleId,
        speed,
        userId: user?.id || "",
        language: selectedLanguage,
      };

      const fileKey = await generateVoice(payload);
      if (fileKey) {
        const audioModel = {
          text: paraText,
          audioKey: fileKey,
          workspaceId: defaultSpace?.id || "",
          persona: voiceStyleName || "Unknown Persona",
          personaId: voiceStyleId || "default-persona-id",
        };

        createAudioModel(audioModel, {
          onSuccess: async () => {
            showToast({
              title: "Success",
              message: "Audio generated successfully",
              variant: "success",
            });
            setParaText("");
            await refetchGeneratedAudios(); // <--- ensure it awaits
          },
          onError: (error) => {
            console.error("Failed to create audio model:", error.message);
            showToast({
              title: "Error",
              message: "Failed to save audio",
              variant: "error",
            });
          },
        });
      } else {
        showToast({
          title: "Error",
          message: "Failed to generate audio",
          variant: "error",
        });
      }
    } catch (err) {
      showToast({
        title: "Error",
        message: "Oops! something went wrong while generating audio",
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: "text", label: "Text to Speech", icon: "/icons/magic.svg" },
    { id: "speech", label: "Speech to Speech", icon: "/icons/microphone.svg" },
  ];
  const voiceTabs = [
    { id: "system", label: "System Voices", icon: "/icons/assets.svg" },
    { id: "user", label: "User Voices", icon: "/icons/voice.svg" },
  ];

  const handleTabChange = (tab: string) => setActiveTab(tab as TabType);
  const handleVoiceTabChange = (tab: string) => setActiveTabVoiceType(tab as VoiceTabType);

  console.log("voice style id --->", voiceStyleId);
  
  console.log("state--------=------>", isProcessing, isUploading, (activeTab === "text" && (!paraText.trim() || !voiceStyleId)), (activeTab === "speech" && (!localFile || !transcript.trim() || !voiceStyleId)));
  

  return (
    <div className="bg-xw-sidebar p-5 flex flex-col h-full w-full gap-5 overflow-hidden">
      <div className="flex-none">
        {/* Switch */}
        <div className="flex items-center gap-2 justify-between">
          <XWTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
          <Button
            size="icon"
            className="rounded-full"
            variant="ghost"
            onClick={handleReset}
          >
            <Image src="/icons/Undo.svg" height={15} width={15} alt="Undo" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-grow overflow-x-hidden">
        <div className="flex flex-col gap-5 pr-4">
          {/* ---------------- TEXT to SPEECH ---------------- */}
          {activeTab === "text" ? (
            <TextToSpeech />
          ) : (
            /* ---------------- SPEECH to SPEECH ---------------- */
            <SpeechToSpeech />
          )}

          <Separator />
          {/* SELECT VOICE */}
          <div className="w-full flex items-center justify-between gap-2">
            <label htmlFor="select" className="whitespace-nowrap">Select File/text Language:<span className="text-red-400">*</span> </label>
            <SelectLanguage value={selectedLanguage} onChange={setSelectedLanguage} />
          </div>


          <Separator />

          {/* ---------------- VOICE SELECTION ---------------- */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 py-3 pl-1 min-w-max">
              <XWTabs
                tabs={voiceTabs}
                activeTab={activeTabVoiceType}
                onChange={handleVoiceTabChange}
              />
            </div>

            <div className="justify-end items-center">
              <CreateUserVoice />
            </div>
          </div>

          {/* Voice Grids */}
          {activeTabVoiceType === "system" ? (
            <SystemVoices />
          ) : (
            <UserVoices />
          )
          }
        </div>
        <ScrollBar />
      </ScrollArea>

      {/* Bottom actions */}
      <div className="flex-none mt-auto">
        <Separator className="mb-2" />
        <div className="flex items-center gap-2 justify-between">
          <VoiceSpeedSelector speed={speed} setSpeed={setSpeed} />
          <Button
            /* Disable if:
                1) We are currently processing/transcribing/fetching
                2) (Text tab) if no paraText or no voice selected
                3) (Speech tab) if no file, no voice selected, or no transcript
            */
            disabled={
              isProcessing ||
              // isGeneratingTransScript ||
              isUploading ||
              // isFetchingURL ||
              (activeTab === "text" && (!paraText.trim() || !voiceStyleId)) ||
              (activeTab === "speech" && (!localFile || !transcript.trim() || !voiceStyleId))
            }
            onClick={
              activeTab === "text"
                ? handleGenerateTextToSpeech
                : handleGenerateSpeechToSpeech
            }
          >
            {(isProcessing || isGeneratingTransScript) && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            {isGeneratingTransScript
              ? "Transcribing"
              : isProcessing
                ? "Generating"
                : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
