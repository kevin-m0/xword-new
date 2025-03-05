"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Separator } from "~/components/ui/separator";
import { Copy, Loader2 } from "lucide-react";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import type { ViralClips } from "@prisma/client";

import { trpc } from "~/trpc/react";
import {
  MIN_VIDEO_DURATION,
  VideoTranscriptActions,
} from "~/lib/constant/videoverse.constants";
import { useOrganization } from "@clerk/nextjs";
import { generateViralClipsTrigger } from "~/app/api/actions/generating-viral-clips/actions";
import { useAtom } from "jotai";
import { creatingClipsAtom } from "~/atoms/videoverseAtoms";
import { motion } from "framer-motion";

const VideoVerseClipsTabRefactored = () => {
  const params = useParams();
  const [creatingClips, setCreatingClips] = useAtom(creatingClipsAtom);
  const videoId = params["video-id"] as string;

  const { organization: workspace } = useOrganization();

  const stopRef = useRef(false);

  const {
    data: viralClips,
    isFetching: isLoadingClipsFromDB,
    error: clipsError,
  } = trpc.videoProject.getViralClips.useQuery<ViralClips[]>(
    { id: videoId },
    {
      enabled: Boolean(videoId),
      refetchOnWindowFocus: false,
    },
  );

  if (isLoadingClipsFromDB) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Fetching your clips...</span>
      </div>
    );
  }

  const { data: video } = trpc.videoProject.getVideoProjectById.useQuery(
    { id: videoId },
    {
      enabled: viralClips?.length > 0,
      refetchOnWindowFocus: false,
    },
  );

  // console.log(video, "current video project");

  const {
    data: viralClipTimestamps,
    isLoading: loadingViralClipTimestamps,
    error: viralClipError,
  } = trpc.videoProject.generateViralClipTimestamps.useQuery(
    { url: video?.videoUrl as string, type: "mux" },
    {
      enabled: !!video?.videoUrl && !viralClips?.length,
      refetchOnWindowFocus: false,
    },
  );

  // if (loadingViralClipTimestamps) {
  //   return (
  //     <div className="flex h-64 items-center justify-center">
  //       <Loader2 className="h-6 w-6 animate-spin" />
  //       <span className="ml-2">Generating clips...</span>
  //     </div>
  //   );
  // }

  const handleCopyTranscript = async (transcript: string) => {
    try {
      await navigator.clipboard.writeText(transcript);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy transcript:", error);
    }
  };

  const handleGenerateClips = async () => {
    setCreatingClips(true);
    // const result = await generateViralClipsTrigger(
    //   viralClipTimestamps,
    //   video,
    //   videoId,
    //   workspace?.id as string,
    // );

    setCreatingClips(false);
  };

  // if (video?.duration && video.duration < MIN_VIDEO_DURATION) {
  //   return (
  //     <div className="p-8 text-center">
  //       <h2 className="mb-2 text-xl font-semibold">Video Too Short</h2>
  //       <p className="text-xw-muted">
  //         Please upload a video longer than 60 seconds to generate clips.
  //       </p>
  //     </div>
  //   );
  // }

  if (creatingClips) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 mt-2">
          You might wanna grab a cup of coffee, this might take a while...
        </span>
      </div>
    );
  }

  if (!viralClips?.length) {
    return (
      <div className="flex flex-col justify-center p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">No Clips created yet</h2>
        <div className="mx-auto mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-fit text-sm"
            onClick={() => {
              handleGenerateClips();
            }}
          >
            Generate viral short clips using AI?
          </motion.div>
        </div>
        <p className="text-xw-muted">
          {/* {loadingViralClipTimestamps
            ? "Generating clips..."
            : "No viral clips have been generated yet."} */}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {viralClips.map((clip, index) => (
        <div key={clip.id} className="flex flex-col gap-5">
          <h2 className="text-2xl font-semibold">
            <span className="text-xw-muted">#{index + 1}</span> - {clip.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {VideoTranscriptActions.map((action) => (
              <XWSecondaryButton
                key={action.name}
                size="sm"
                className2="text-sm xw-premium-div w-fit px-3"
                onClick={() => {
                  if (action.name === "Open in Editor")
                    window.location.href = `/videoverse/${clip.id}/editor?viralClips=true`;
                }}
              >
                <Image
                  src={action.icon || "/placeholder.svg"}
                  alt={action.name}
                  width={16}
                  height={16}
                />
                {action.name}
              </XWSecondaryButton>
            ))}
          </div>

          <div className="flex gap-6 rounded-lg border border-xw-secondary p-2">
            <div className="relative aspect-video w-1/2">
              <video
                src={clip.videoUrl}
                className="h-[720px] w-full rounded"
                playsInline
                autoPlay
                loop
                preload="metadata"
                muted
              />
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex w-full items-center gap-2">
                <Image
                  src="/icons/captions.svg"
                  alt="captions"
                  width={16}
                  height={16}
                />
                <h3 className="text-lg font-semibold">Transcript</h3>
                <div className="ml-auto">
                  <XWSecondaryButton
                    size="sm"
                    className2="text-xs xw-premium-div w-fit px-3"
                    onClick={() => handleCopyTranscript(clip.transcript || "")}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Transcript
                  </XWSecondaryButton>
                </div>
              </div>

              <Separator className="my-4" />

              {clip.transcript ? (
                <>
                  <span className="mb-2 text-xs text-xw-muted">
                    {clip.duration} secs
                  </span>
                  <p className="text-sm text-xw-muted-foreground">
                    {clip.transcript}
                  </p>
                </>
              ) : (
                <p className="text-sm text-xw-muted">
                  No transcript available for this clip.
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoVerseClipsTabRefactored;
