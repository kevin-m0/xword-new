import { z } from "zod";

export const audioProjectSchema = z.object({
  title: z.string(),
  transcript: z.string(),
  subtitles: z.string(),
  words: z.string(),
  workspaceId: z.string(),
  storageKey: z.string(),
  processStatus: z.enum(["PROCESSING", "COMPLETED"]),
  type: z.enum(["Upload", "YouTube"]),
  createdBy: z.string(),
});
