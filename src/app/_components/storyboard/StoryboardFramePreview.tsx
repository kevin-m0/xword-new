"use client";

import { useEffect, useRef, useState } from "react";
import { StoryboardFrame } from "~/types";
import { Loader2, Video } from "lucide-react";
import { generateStoryboard } from "~/utils/storyboard";
import { useAtom } from "jotai";
import {
  finalStoryboardVideoAtom,
  storyBoardScriptAtom,
  storyboardStyleAtom,
} from "~/atoms";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

interface StoryboardPreviewProps {
  frames: StoryboardFrame[];
  isGenerating: boolean;
  totalFrames?: number;
}

export function StoryboardFramePreview({
  isGenerating,
  totalFrames = 10,
}: StoryboardPreviewProps) {
  const [script, setScript] = useAtom(storyBoardScriptAtom);
  const [style, setStyle] = useAtom(storyboardStyleAtom);
  const isGeneratingStoryboard = useRef("");
  const [frames, setFrames] = useState<StoryboardFrame[]>([]);
  useEffect(() => {
    const handleCreateStoryboard = async () => {
      if (!script) {
        toast.error("Please generate a script first");
        return;
      }

      isGeneratingStoryboard.current = "yes";
      setFrames([]);

      try {
        console.log("inside try");
        const response = await generateStoryboard(script, style, (newFrame) => {
          setFrames((currentFrames) => [...currentFrames, newFrame]);
        });

        if (!response.success) {
          toast.error(response.error || "Failed to generate storyboard");
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      } finally {
        isGeneratingStoryboard.current = "no";
      }
    };

    // Prevent multiple calls if the storyboard is already being generated
    if (
      isGeneratingStoryboard.current === "" ||
      isGeneratingStoryboard.current === "no"
    ) {
      handleCreateStoryboard();
    }
  }, [script, style]);

  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useAtom(finalStoryboardVideoAtom);

  const handleCreateVideo = async () => {
    if (isCreatingVideo || frames.length === 0) return;

    setIsCreatingVideo(true);
    // try {
    //   const videoBlob = await createVideoFromFramesServer(frames);
    //   // const url = URL.createObjectURL(videoBlob);
    //   // setVideoUrl(url);
    // } catch (error) {
    //   console.error("Failed to create video:", error);
    // } finally {
    //   setIsCreatingVideo(false);
    // }
    try {
      const response = await fetch("/api/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames }),
      });

      if (!response.ok) {
        throw new Error("Failed to create video");
      }

      const videoUrl = await response.json();

      console.log(videoUrl, "all the urls");

      setVideoUrl(videoUrl.finalUrl.secure_url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingVideo(false);
    }
  };

  const renderPlaceholder = (index: number) => (
    <div key={`placeholder-${index}`} className="space-y-3">
      <div className="relative flex aspect-video animate-pulse items-center justify-center rounded-lg bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
      </div>
      <div className="h-12 animate-pulse rounded bg-gray-100" />
    </div>
  );

  return (
    <div className="space-y-6">
      {videoUrl && (
        <video src={videoUrl} controls className="mx-auto h-[500px] w-3/4" />
      )}
      <div className="flex items-center justify-between px-8 pt-4">
        <h3 className="text-xl font-semibold">Storyboard Preview</h3>
        {isGeneratingStoryboard.current === "no" && frames.length > 0 && (
          <button
            onClick={handleCreateVideo}
            disabled={isCreatingVideo}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Video className="h-5 w-5" />
            {isCreatingVideo ? "Creating Video..." : "Create Video"}
          </button>
        )}
      </div>

      <div className="grid w-full grid-cols-5 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {frames.map((frame, index) => (
          <div key={index} className="space-y-3">
            <div className="relative aspect-video">
              <img
                src={frame.imageUrl}
                alt={`Frame ${index + 1}`}
                className="object-fit w-full rounded-lg p-2 shadow-md"
              />
              <div className="rounded-b-lg bg-black bg-opacity-60 p-3">
                <p className="text-base text-white">{frame.subtitle}</p>
              </div>
            </div>
            <audio controls className="h-12 w-full rounded-lg">
              <source src={frame.audioUrl} type="audio/mpeg" />
            </audio>
            <Button className="px-4 py-2">Regenerate Frame</Button>
          </div>
        ))}
        {isGenerating &&
          Array.from({ length: totalFrames - frames.length }).map((_, i) =>
            renderPlaceholder(i + frames.length),
          )}
      </div>
    </div>
  );
}
