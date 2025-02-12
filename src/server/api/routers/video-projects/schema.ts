import { z } from "zod";

export const videoModelSchema = z.object({
  title: z.string(),
  description: z.string(),
  ytChapters: z.string(),
  transcript: z.string(),
  subtitles: z.string(),
  words: z.string(),
  workspaceId: z.string(),
  videoUrl: z.string(),
  processStatus: z.enum(["PROCESSING", "COMPLETED"]),
  videoType: z.enum(["UPLOAD", "YOUTUBE"]),
  createdBy: z.string(),
  thumbnailUrl: z.string().optional(),
  path: z.string().optional(),
  duration: z.number(),
});

export const viralClipModelSchema = z.object({
  title: z.string(),
  description: z.string(),
  workspaceId: z.string(),
  parentVideoId: z.string(),
  subtitles: z.string(),
  transcript: z.string(),
  processStatus: z.enum(["PROCESSING", "COMPLETED"]),
  videoUrl: z.string(),
  thumbnailUrl: z.string(),
  duration: z.number(),
  words: z.string(),
});
