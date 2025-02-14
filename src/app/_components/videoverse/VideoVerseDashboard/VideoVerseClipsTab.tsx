import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Separator } from "~/components/ui/separator";
import { Copy, Loader2 } from "lucide-react";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { type ViralClips } from "@prisma/client";
import { trim } from "@cloudinary/url-gen/actions/videoEdit";
import { Cloudinary } from "@cloudinary/url-gen";
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
  transcript?: string;
  subtitles?: string;
  words?: string;
}

interface ClipData {
  title: string;
  description: string;
  parentVideoId: string;
  workspaceId: string;
  videoUrl: string;
  processStatus: string;
  thumbnailUrl: string;
  transcript?: string;
  subtitles?: string;
}

const CLOUDINARY_CLOUD_NAME = "dngbwns3v";
const MIN_VIDEO_DURATION = 60; // seconds
const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dngbwns3v/upload";

const VideoVerseClipsTab = () => {
  const params = useParams();
  const [parentId, setParentId] = useState<string>("");
  const [creatingClips, setCreatingClips] = useState(false);
  const videoId = params["video-id"] as string;
  const { data: activeWorkspace } = useGetActiveSpace();
  const [childrenClips, setChildrenClips] = useState<"yes" | "no" | null>(null);
  const childrenClipRef = useRef("");
  const [clipsGenerated, setClipsGenerated] = useState(false);
  const stopRef = useRef(false);

  const cld = new Cloudinary({
    cloud: { cloudName: CLOUDINARY_CLOUD_NAME },
  });

  const { mutateAsync: saveClipToDB } =
    trpc.videoProject.createViralClip.useMutation();

  // Query for viral clips
  const {
    data: viralClips,
    isLoading: isLoadingClipsFromDB,
    error: clipsError,
  } = trpc.videoProject.getViralClips.useQuery<ViralClips[]>(
    { id: videoId },
    {
      enabled: Boolean(videoId),
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log(data, "clips from db");
        if (data.length > 0) {
          childrenClipRef.current = "yes";
          console.log("clips found");
        } else {
          childrenClipRef.current = "no";
          stopRef.current = false;
        }
      },
    },
  );

  // Query for parent video data
  const {
    data: video,
    isLoading: videoLoading,
    error: videoError,
  } = trpc.videoProject.getVideoProjectById.useQuery(
    { id: videoId },
    {
      enabled: childrenClipRef.current === "no" && viralClips?.length === 0,
      refetchOnWindowFocus: false,
    },
  );

  // Generate viral clip timestamps
  const {
    data: viralClipTimestamps = [],
    isLoading: loadingViralClipTimestamps,
    error: viralClipError,
  } = trpc.videoProject.generateViralClipTimestamps.useQuery(
    {
      url: video?.videoUrl as string,
      type: "mux",
    },
    {
      enabled:
        !!video?.videoUrl &&
        !childrenClipRef.current &&
        viralClips?.length === 0,
      onSuccess: (data) => {
        console.log(data, "timestamps");
        const video2 = {
          videoUrl: video?.videoUrl as string, // Replace with actual video URL
          thumbnailUrl: video?.thumbnailUrl as string,
        };
        if (stopRef.current) return;
        createClips(data, video2, videoId, {
          setCreatingClips,
          setClipsGenerated,
        });
      },
    },
  );

  const createClips = async (
    timestamps: Timestamp[],
    video: { videoUrl: string; thumbnailUrl: string },
    videoId: string,
    {
      setCreatingClips,
      setClipsGenerated,
    }: {
      setCreatingClips: (value: boolean) => void;
      setClipsGenerated: (value: boolean) => void;
    },
  ) => {
    console.log("inside create clips");
    if (!timestamps.length || !video?.videoUrl) {
      console.log("No timestamps generated");
      return;
    }

    setCreatingClips(true);

    try {
      const publicId = video.videoUrl.split("/").pop()?.split(".")[0];
      if (!publicId) throw new Error("Invalid video URL");

      for (const clip of timestamps) {
        await processClip(clip, publicId, video, videoId);
      }

      setClipsGenerated(true);
    } catch (error) {
      console.error("Error creating clips:", error);
      throw error; // Re-throw to handle in the component
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
    // 1. Create and transform the clip
    const createdClip = createCloudinaryTransformation(clip, publicId);
    const videoUrl = createdClip.toURL();

    // 2. Wait for transformation completion
    const isTransformationComplete = await pollRequest(videoUrl);
    if (!isTransformationComplete) {
      throw new Error("Video transformation failed");
    }

    // 3. Upload to Cloudinary
    const uploadData = await uploadToCloudinary(videoUrl);

    // 4. Generate metadata using LLM
    const metadata = await generateMetadata(videoUrl);

    // 5. Save to database
    await saveClipToDB({
      title: metadata.title,
      description: "Generated clip",
      parentVideoId: videoId,
      workspaceId: "cm5ocl74q000t9kd83u7sibxj",
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
    return (
      cld
        .video(publicId)
        .videoEdit(
          trim()
            .startOffset(clip.start_time / 1000)
            .endOffset(clip.end_time / 1000),
        )
        // .resize(fill().width(1080).height(1920).gravity(compass("center")));
        .resize(fill().width(1080).height(1920).gravity(autoGravity()))
    );
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

  // Show loading state for any loading operation
  if (
    isLoadingClipsFromDB ||
    (childrenClips === "no" &&
      (videoLoading || loadingViralClipTimestamps || creatingClips))
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

  // Show error state if any operation fails
  if (clipsError || videoError || viralClipError) {
    return (
      <div className="p-4 text-red-500">
        Error loading content. Please try again later.
      </div>
    );
  }

  // Show message if video is too short
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
                  src={action.icon}
                  alt={action.name}
                  width={16}
                  height={16}
                />
                {action.name}
              </XWSecondaryButton>
            ))}
          </div>

          <div className="border-xw-secondary flex gap-6 rounded-lg border p-2">
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
                  <span className="text-xw-muted mb-2 text-xs">
                    {clip.duration} secs
                  </span>
                  <p className="text-xw-muted-foreground text-sm">
                    {clip.transcript}
                  </p>
                </>
              ) : (
                <p className="text-xw-muted text-sm">
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

export default VideoVerseClipsTab;
