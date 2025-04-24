"use server";

import { generateViralClips } from "~/trigger/clips";
import { Timestamp } from "~/types/videoverse.types";

export async function generateViralClipsTrigger(
  timestamps: Timestamp[],
  video: { videoUrl: string; thumbnailUrl: string | null },
  videoId: string,
  workspaceId: string,
) {
  const handle = await generateViralClips.trigger({
    timestamps: timestamps,
    video: { videoUrl: video.videoUrl, thumbnailUrl: video.thumbnailUrl },
    videoId: videoId,
    workspaceId,
  });

  return handle.id;
}
