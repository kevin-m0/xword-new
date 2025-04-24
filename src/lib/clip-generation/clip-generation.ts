import { Timestamp, VideoMetadata } from "~/types/videoverse.types";
import { v2 as cloudinary } from "cloudinary";
import { pollRequest } from "~/utils/utils";
import { db } from "~/server/db";

export const createClips = async (
  timestamps: Timestamp[],
  video: { videoUrl: string; thumbnailUrl: string | null },
  videoId: string,
  workspaceId: string,
) => {
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
        workspaceId,
      );
    }
  } catch (error) {
    console.error("Error creating clips:", error);
  }
};

const processClip = async (
  clip: Timestamp,
  publicId: string,
  video: { videoUrl: string; thumbnailUrl: string },
  videoId: string,
  workspaceId: string,
) => {
  const videoUrl = createCloudinaryTransformation(clip, publicId);

  const isTransformationComplete = await pollRequest(videoUrl);
  if (!isTransformationComplete) {
    throw new Error("Video transformation failed");
  }

  const uploadData = await uploadToCloudinary(videoUrl);
  const metadata = await generateMetadata(videoUrl);

  console.log("creating db entry");
  await db.viralClips.create({
    data: {
      title: metadata.title,
      description: "Generated clip",
      parentVideoId: videoId,
      workspaceId: workspaceId,
      videoUrl: uploadData.secure_url,
      processStatus: "COMPLETED",
      thumbnailUrl: video.thumbnailUrl,
      transcript: metadata?.transcript as string,
      subtitles: metadata?.subtitles as string,
      duration: clip.end_time - clip.start_time,
      words: JSON.stringify(metadata?.words),
    },
  });
  console.log("db entry created");
};

const createCloudinaryTransformation = (clip: Timestamp, publicId: string) => {
  return cloudinary.url(publicId, {
    resource_type: "video",
    transformation: [
      {
        start_offset: clip.start_time / 1000,
        end_offset: clip.end_time / 1000,
      },
      {
        width: "1080",
        height: "1920",
        crop: "fill",
      },
      { gravity: "auto" },
    ],
  });
};

const uploadToCloudinary = async (videoUrl: string) => {
  const response = await cloudinary.uploader.upload(videoUrl, {
    resource_type: "video",
  });

  return response;
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

  return await response.json(); // ✅ Ensure we await response.json()
};
