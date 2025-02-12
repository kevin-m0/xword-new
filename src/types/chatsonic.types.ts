import { SonicMessage } from "@prisma/client";
export interface UploadedFile {
  id: string;
  mimeType: string;
  originalFileName:string;
  type: "document" | "image" | "audio";
}

export type UseSend = {
  fileIds: { id: string; filename: string }[];
  otherFiles: {
    files: { id: string; mimeType: string }[];
  };
  chatInput: string;
  clearInput?: () => void;
  sessionId: string;
  isChatExist: boolean;
  urls: string[];
  avatarId: string;
  mode: "Normal" | "Docs" | "Web";
  category: string;
  publishDate: string;
  includeDomains: string[];
};

export interface FileInfo {
  id: string;
  fileName: string;
  fileExtension: string;
  contentType: string;
  size: number;
  type: "document" | "image" | "audio";
}

export interface MessageFiles {
  fileIds: { id: string; filename: string }[];
  otherFiles: {
    files: UploadedFile[]; // For images and audio
  };
  Urls: string[]; // For URLs
}

export enum PromptType {
  TEXT,
  IMAGE,
  DOCUMENT,
  UNKNOWN,
  AUDIO,
  URL,
}

export interface OpenSections {
  chats: boolean;
  categories: boolean;
  publishDate: boolean;
  domains: boolean;
}

export type Source = {
  title: string;
  url: string;
};

export type Message = SonicMessage & {
  sources?: string | Source[];
};

export const Roles = {
  User: "user",
  AI: "ai",
};

export const Modes = {
  Normal: "Normal",
  Docs: "Docs",
  Web: "Web",
};
