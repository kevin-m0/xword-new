import { z } from "zod";

export const BrandVoiceSchema = z.object({
  name: z.string(),
  specialization: z.string(),
  audience: z.string(),
  purpose: z.string(),
  tone: z.array(z.string()),
  emotions: z.array(z.string()),
  character: z.array(z.string()),
  genre: z.array(z.string()),
  languageStyle: z.array(z.string()),
  brandVoice: z.string(),
});

export const MessageSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  sessionId: z.string(),
  avatarId: z.string(),
  brandVoice: BrandVoiceSchema,
  lastMessages: z.array(z.string()),
  mode: z.string(),
  fileIds: z.array(z.object({
    id: z.string(),
    filename: z.string(),
  })),
  category: z.string().optional(),
  publishDate: z.string().optional(),
  includeDomains: z.array(z.string()).optional(),
  otherFiles: z.object({
    files: z.array(z.object({
      id: z.string(),
      mimeType: z.string(),
    })),
  }),
  Urls: z.array(z.string()),
  query: z.string(),
  role: z.enum(['user', 'ai']).default('user'),
  sources: z.string().optional(),
});

export const createChatSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),
  userId: z.string(),
  lastPromptPayload: z.string().optional(),
});

export type CreateChatSchema = z.infer<typeof createChatSchema>;
