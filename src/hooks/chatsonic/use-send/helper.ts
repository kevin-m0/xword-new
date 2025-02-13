
import { Role } from "@prisma/client";
import { Message, Modes, Source } from "~/types/chatsonic.types";

export const createResponseTemplate = (chatId: string): Message => {
  return {
    id: crypto.randomUUID(),
    userId: crypto.randomUUID(),
    sessionId: chatId,
    avatarId: "",
    brandVoice: JSON.stringify({}),
    lastMessages: [],
    mode: Modes.Normal,
    fileIds: [],
    otherFiles: [],
    category: null,
    publishDate: null,
    includeDomains: [],
    Urls: [],
    query: "",
    role: Role.ai,
    sources: JSON.stringify([]) as string & Source[],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
