// components/FlowContentSelection/components/AudioInput.tsx
"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Check } from "lucide-react";
import { multiFlowPrompt, multiFlowTranscribe } from "~/atoms/multiFlow";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { uploadFile } from "~/services/aws-file-upload";
import { Tabs } from "~/components/reusable/XWNewTab";
import XWDropBox from "~/components/reusable/XWDropBox";
import { getAwsUrl } from "~/lib/get-aws-url";

export const AudioInput = ({ onNext }: { onNext: (url: string) => void }) => {
  const [isTranscribing, setIsTranscribing] = useAtom(multiFlowTranscribe);
  const [, setTranscript] = useAtom(multiFlowPrompt);
  const [audioUrl, setAudioUrl] = useState("");
  const { showToast } = useXWAlert();

  const handleUrlTranscription = async () => {
    if (!audioUrl.trim()) {
      return showToast({
        title: "Error",
        message: "Please enter a valid URL",
        variant: "error",
      });
    }

    onNext(audioUrl);
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) {
      showToast({
        title: "Error",
        message: "Please select a file to upload",
        variant: "caution",
      });
      return;
    }

    setIsTranscribing(true);
    const fileId = crypto.randomUUID();

    try {
      await uploadFile(file, fileId);
      const fileUrl = getAwsUrl(fileId) as string;
      onNext(fileUrl);
    } catch (error) {
      showToast({
        title: "Upload Failed",
        message: "There was an error uploading your file.",
        variant: "error",
      });
    }
  };

  return (
    <div className="flex w-full flex-col space-y-10">
      <Tabs defaultValue="upload" className="flex w-full flex-col gap-6">
        {/* <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Audio</TabsTrigger>
                    <TabsTrigger value="url">Audio URL</TabsTrigger>
                </TabsList> */}

        {/* <TabsContent value="upload" className="space-y-4"> */}
        <div className="space-y-2">
          <Label>Upload Audio File</Label>
          <XWDropBox
            title="Drag & Drop Audio File"
            description=".mp3, .wav, .aac etc. are supported"
            acceptTypes={{ "audio/*": [] }}
            onFileChange={handleFileUpload}
            validateFile={(file) => {
              const maxSize = 100 * 1024 * 1024; // 100MB
              if (file.size > maxSize) {
                return "File size should be less than 100MB";
              }
              return true;
            }}
          />
        </div>
        {/* </TabsContent> */}
        <div className="border-xw-border relative w-full border-t">
          <div className="bg-xw-sidebar absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform p-1">
            OR
          </div>
        </div>

        {/* <TabsContent value="url" className="space-y-10"> */}
        <div className="space-y-2">
          <Label>Audio URL</Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="Enter audio URL..."
              className="flex-1"
            />
            <div>
              <Button
                type="button"
                variant="default"
                size={"icon"}
                onClick={handleUrlTranscription}
                disabled={isTranscribing || !audioUrl}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* </TabsContent> */}
      </Tabs>
    </div>
  );
};

// components/FlowContentSelection/components/VideoInput.tsx
export const VideoInput = ({ onNext }: { onNext: (url: string) => void }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const { showToast } = useXWAlert();
  const [isTranscribing, setIsTranscribing] = useAtom(multiFlowTranscribe);

  const handleUrlTranscription = async () => {
    if (!videoUrl.trim()) {
      return showToast({
        title: "Error",
        message: "Please enter a valid URL",
        variant: "error",
      });
    }

    onNext(videoUrl);
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) {
      // Handle the case where no file is selected or it's null.
      showToast({
        title: "Error",
        message: "Please select a file to upload",
        variant: "caution",
      });
      return;
    }
    const fileId = crypto.randomUUID();

    try {
      await uploadFile(file, fileId);
      const fileUrl = getAwsUrl(fileId) as string;
      onNext(fileUrl);
    } catch (error) {
      showToast({
        title: "Upload Failed",
        message: "There was an error uploading your file.",
        variant: "error",
      });
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="upload" className="flex w-full flex-col gap-6">
        {/* <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Video</TabsTrigger>
                    <TabsTrigger value="url">Video URL</TabsTrigger>
                </TabsList> */}

        {/* <TabsContent value="upload" className="space mt-4"> */}
        <div className="space-y-2">
          <Label>Upload Video File</Label>
          <XWDropBox
            title="Drag & Drop Video File"
            description=".mp4, .mov etc. are supported"
            acceptTypes={{ "video/*": [] }}
            onFileChange={handleFileUpload}
            validateFile={(file) => {
              const maxSize = 500 * 1024 * 1024; // 500MB
              if (file.size > maxSize) {
                return "File size should be less than 500MB";
              }
              return true;
            }}
          />
        </div>
        {/* </TabsContent> */}

        <div className="border-xw-border relative w-full border-t">
          <div className="bg-xw-sidebar absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform p-1">
            OR
          </div>
        </div>

        {/* <TabsContent value="url" className="space-y-4"> */}
        <div className="space-y-2">
          <Label>Video URL</Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL (YouTube or direct link)..."
              className="flex-1"
            />
            <div>
              <Button
                type="button"
                variant="default"
                size={"icon"}
                onClick={handleUrlTranscription}
                disabled={isTranscribing || !videoUrl}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* </TabsContent> */}
      </Tabs>
    </div>
  );
};
