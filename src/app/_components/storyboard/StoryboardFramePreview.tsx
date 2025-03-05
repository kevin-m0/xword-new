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
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Image from "next/image";

interface StoryboardPreviewProps {
  isGenerating: boolean;
  totalFrames?: number;
  frames: StoryboardFrame[];
}

export function StoryboardFramePreview({
  isGenerating,
  totalFrames = 10,
}: StoryboardPreviewProps) {
  const [script] = useAtom(storyBoardScriptAtom);
  const [style] = useAtom(storyboardStyleAtom);
  const [frames, setFrames] = useState<StoryboardFrame[]>([]);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useAtom(finalStoryboardVideoAtom);
  const isGeneratingStoryboard = useRef(false);

  useEffect(() => {
    const createStoryboard = async () => {
      if (!script) {
        toast.error("Please generate a script first");
        return;
      }

      isGeneratingStoryboard.current = true;
      setFrames([]);

      try {
        const response = await generateStoryboard(script, style, (newFrame) => {
          setFrames((prevFrames) => [...prevFrames, newFrame]);
        });

        if (!response.success) {
          toast.error(response.error || "Failed to generate storyboard");
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
      } finally {
        isGeneratingStoryboard.current = false;
      }
    };

    if (!isGeneratingStoryboard.current) {
      createStoryboard();
    }
  }, [script, style]);

  const handleCreateVideo = async () => {
    if (isCreatingVideo || frames.length === 0) return;
    setIsCreatingVideo(true);

    try {
      const response = await fetch("/api/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames }),
      });

      if (!response.ok) throw new Error("Failed to create video");

      const videoData = await response.json();
      setVideoUrl(videoData.finalUrl.secure_url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingVideo(false);
    }
  };

  return (
    <div className="space-y-6">
      {videoUrl && (
        <video src={videoUrl} controls className="mx-auto h-[500px] w-3/4" />
      )}

      <div className="flex items-center justify-between px-8 pt-4">
        <h3 className="text-xl font-semibold">Storyboard Preview</h3>
        {frames.length > 0 && !isGeneratingStoryboard.current && (
          <Button onClick={handleCreateVideo} disabled={isCreatingVideo}>
            <Video className="h-5 w-5" />{" "}
            {isCreatingVideo ? "Creating Video..." : "Create Video"}
          </Button>
        )}
      </div>

      <Card className="border-2">
        <CardContent className="p-4">
          <Tabs defaultValue="grid">
            <div className="mb-4 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="slideshow">Slideshow</TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">
                {style} style • 16:9
              </div>
            </div>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {frames.map((frame, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
                      <Image
                        src={frame.imageUrl || "/placeholder.svg"}
                        alt={`Frame ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute left-2 top-2 rounded bg-background/80 px-2 py-1 text-xs font-medium text-foreground">
                        {index + 1}
                      </div>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {frame.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {frame.audioUrl}
                      {frame.timestamp}
                    </p>
                  </div>
                ))}
                {isGenerating &&
                  Array.from({ length: totalFrames - frames.length }).map(
                    (_, i) => (
                      <div
                        key={`placeholder-${i}`}
                        className="animate-pulse space-y-3"
                      >
                        <div className="relative flex aspect-video items-center justify-center rounded-lg bg-gray-100">
                          <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
                        </div>
                        <div className="h-12 rounded bg-gray-100" />
                      </div>
                    ),
                  )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
