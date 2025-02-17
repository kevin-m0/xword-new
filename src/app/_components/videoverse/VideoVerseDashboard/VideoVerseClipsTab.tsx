"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Separator } from "~/components/ui/separator";
import { Copy, Loader2 } from "lucide-react";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import type { ViralClips } from "@prisma/client";
import { Cloudinary } from "@cloudinary/url-gen";
import { trim } from "@cloudinary/url-gen/actions/videoEdit";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { pollRequest } from "~/utils/utils";
import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import { trpc } from "~/trpc/react";
import { VideoTranscriptActions } from "~/lib/constant/videoverse.constants";

interface Timestamp {
  start_time: number;
  end_time: number;
}

interface VideoMetadata {
  title: string;
  transcript: string;
  subtitles: string;
  words: any[];
}

const CLOUDINARY_CLOUD_NAME = "dngbwns3v";
const MIN_VIDEO_DURATION = 60; // seconds
const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dngbwns3v/upload";

const VideoVerseClipsTabRefactored = () => {
  const params = useParams();
  const [creatingClips, setCreatingClips] = useState(false);
  const videoId = params["video-id"] as string;
  const { data: activeWorkspace } = useGetActiveSpace();
  const [clipsGenerated, setClipsGenerated] = useState(false);
  const stopRef = useRef(false);

  const cld = new Cloudinary({
    cloud: { cloudName: CLOUDINARY_CLOUD_NAME },
  });

  const createVideoProjectMutation =
    trpc.videoProject.createViralClip.useMutation();

  const {
    data: viralClips,
    isLoading: isLoadingClipsFromDB,
    error: clipsError,
  } = trpc.videoProject.getViralClips.useQuery<ViralClips[]>(
    { id: videoId },
    { enabled: Boolean(videoId), refetchOnWindowFocus: false },
  );

  const {
    data: video,
    isLoading: videoLoading,
    error: videoError,
  } = trpc.videoProject.getVideoProjectById.useQuery(
    { id: videoId },
    {
      enabled: Boolean(videoId) && !viralClips?.length,
      refetchOnWindowFocus: false,
    },
  );

  const {
    data: viralClipTimestamps,
    isLoading: loadingViralClipTimestamps,
    error: viralClipError,
  } = trpc.videoProject.generateViralClipTimestamps.useQuery(
    { url: video?.videoUrl as string, type: "mux" },
    { enabled: !!video?.videoUrl && !viralClips?.length },
  );

  useEffect(() => {
    if (
      viralClipTimestamps &&
      video &&
      !viralClips?.length &&
      !stopRef.current
    ) {
      createClips(viralClipTimestamps, video, videoId);
    }
  }, [viralClipTimestamps, video, videoId, viralClips]);

  const createClips = async (
    timestamps: Timestamp[],
    video: { videoUrl: string; thumbnailUrl: string | null },
    videoId: string,
  ) => {
    if (!timestamps.length || !video?.videoUrl) {
      console.log("No timestamps generated");
      return;
    }

    setCreatingClips(true);

    try {
      const publicId = video.videoUrl.split("/").pop()?.split(".")[0];
      if (!publicId) throw new Error("Invalid video URL");

      for (const clip of timestamps) {
        await processClip(
          clip,
          publicId,
          {
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl as string,
          },
          videoId,
        );
      }

      setClipsGenerated(true);
    } catch (error) {
      console.error("Error creating clips:", error);
    } finally {
      setCreatingClips(false);
    }
  };

  const processClip = async (
    clip: Timestamp,
    publicId: string,
    video: { videoUrl: string; thumbnailUrl: string },
    videoId: string,
  ) => {
    const createdClip = createCloudinaryTransformation(clip, publicId);
    const videoUrl = createdClip.toURL();

    const isTransformationComplete = await pollRequest(videoUrl);
    if (!isTransformationComplete) {
      throw new Error("Video transformation failed");
    }

    const uploadData = await uploadToCloudinary(videoUrl);
    const metadata = await generateMetadata(videoUrl);

    await createVideoProjectMutation.mutateAsync({
      title: metadata.title,
      description: "Generated clip",
      parentVideoId: videoId,
      workspaceId: activeWorkspace?.id as string,
      videoUrl: uploadData.secure_url,
      processStatus: "COMPLETED",
      thumbnailUrl: video.thumbnailUrl,
      transcript: metadata?.transcript as string,
      subtitles: metadata?.subtitles as string,
      duration: clip.end_time - clip.start_time,
      words: JSON.stringify(metadata?.words),
    });
  };

  const createCloudinaryTransformation = (
    clip: Timestamp,
    publicId: string,
  ) => {
    return cld
      .video(publicId)
      .videoEdit(
        trim()
          .startOffset(clip.start_time / 1000)
          .endOffset(clip.end_time / 1000),
      )
      .resize(fill().width(1080).height(1920).gravity(autoGravity()));
  };

  const uploadToCloudinary = async (videoUrl: string) => {
    const formData = new FormData();
    formData.append("file", videoUrl);
    formData.append("upload_preset", "unsigned-preset");
    formData.append("resource_type", "video");

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload video");
    }

    return response.json();
  };

  const generateMetadata = async (videoUrl: string): Promise<VideoMetadata> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/generate-all`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
        },
        body: JSON.stringify({
          url: videoUrl,
          type: "mux",
          languagecode: "en",
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to generate content");
    }

    return response.json();
  };

  const handleCopyTranscript = async (transcript: string) => {
    try {
      await navigator.clipboard.writeText(transcript);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy transcript:", error);
    }
  };

  if (
    isLoadingClipsFromDB ||
    videoLoading ||
    loadingViralClipTimestamps ||
    creatingClips
  ) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">
          {loadingViralClipTimestamps
            ? "Finding viral clips..."
            : videoLoading
              ? "Loading video details..."
              : creatingClips
                ? "Creating clips for you..."
                : "Loading clips..."}
        </span>
      </div>
    );
  }

  if (clipsError || videoError || viralClipError) {
    return (
      <div className="p-4 text-red-500">
        Error loading content. Please try again later.
      </div>
    );
  }

  if (video?.duration && video.duration < MIN_VIDEO_DURATION) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">Video Too Short</h2>
        <p className="text-xw-muted">
          Please upload a video longer than 60 seconds to generate clips.
        </p>
      </div>
    );
  }

  if (!viralClips?.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">No Clips Found</h2>
        <p className="text-xw-muted">
          {loadingViralClipTimestamps
            ? "Generating clips..."
            : "No viral clips have been generated yet."}
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
