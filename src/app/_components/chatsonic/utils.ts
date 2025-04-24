import { toast } from "sonner";
import { nanoid } from "~/lib/nanoid";
import { RefObject } from "react";

const mimeTypeMap = {
  // Document formats
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/pdf": "pdf",

  // Image formats
  "image/jpeg": "jpg", // Covers both .jpeg and .jpg
  "image/png": "png",

  // Audio formats
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
} as const; // Ensures the object is treated with literal types

// Extract MimeType as a union of the keys from mimeTypeMap
type MimeType = keyof typeof mimeTypeMap;
// Extract FileExtension as a union of the values from mimeTypeMap
type FileExtension = (typeof mimeTypeMap)[MimeType];

// Function that returns a file extension for a given MIME type or "unknown" if not found
export function getReadableFileType(
  mimeType: string
): FileExtension | "unknown" {
  // Ensure mimeType is treated as a key of mimeTypeMap or return "unknown" if the key does not exist
  return mimeTypeMap[mimeType as MimeType] ?? "unknown";
}

export const checkIsValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const handleImageDownload = async (fileUrl: string) => {
  const fileName = Date.now() + nanoid(10);
  try {
    if (!fileUrl) {
      toast.error("Failed to download image. Please try again.");
      return;
    }

    const response = await fetch(fileUrl);

    if (!response.ok) {
      toast.error("Failed to download image. Please try again.");
      return;
    }

    const blob = await response.blob();
    const fileExtension = "jpeg";

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}.${fileExtension}`;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
  } catch (error) {
    toast.error("Failed to download image. Please try again.");
  }
};

export const copyImage = (imageRef: RefObject<HTMLImageElement>) => {
  if (imageRef.current) {
    const image = imageRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(image, 0, 0);
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob,
              }),
            ]);
            toast.success("Image copied to clipboard.");
          } catch (error) {
            toast.error("Failed to copy image to clipboard.");
          }
        }
      });
    }
  }
};

export const isImageResponse = (response: Response) => {
  const isImageResponse =
    response.headers.has("X-Response-Type") &&
    response.headers.get("X-Response-Type")?.trim() === "Image";

  if (isImageResponse) return true;
  return false;
};

const isJsonResponse = (response: Response): boolean => {
  const contentType = response.headers.get("Content-Type");
  if (!contentType) return false;
  return contentType?.includes("application/json");
};

const isStreamResponse = (response: Response): boolean => {
  // If body is a ReadableStream, then it's a streamed response
  return response.body instanceof ReadableStream;
};

export const isNotStreamResponse = (response: Response): boolean => {
  const isJsonRes = isJsonResponse(response);
  //we know if response type is image then it will be not stream
  const isImageRes = isImageResponse(response);
  //we know if response type is json then it will be not stream
  const isStreamRes = isStreamResponse(response);
 
  return isJsonRes || isImageRes || !isStreamRes;
};

export function handleFilePreview(fileUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Mapping from avatarId to image URL
export const avatarImageMap: Record<string, string> = {
  "prompt-expert": "/images/chatsonic/prompt-expert.webp",
  "content-ideator": "/images/chatsonic/content-ideator.webp",
  "content-polisher": "/images/chatsonic/content-polisher.webp",
  "ad-crafter": "/images/chatsonic/ad-crafter.webp",
  "language-bridge": "/images/chatsonic/language-bridge.webp",
  "data-analyst": "/images/chatsonic/data-analyst.webp",
  "research-guru": "/images/chatsonic/research-guru.webp",
  "strategic-thinker": "/images/chatsonic/strategic-thinker.webp",
  "customer-support-guru": "/images/chatsonic/customer-support-guru.webp",
  "creative-visionary": "/images/chatsonic/creative-visionary.webp",
  "project-manager": "/images/chatsonic/project-manager.webp",
  "legal-advisor": "/images/chatsonic/legal-advisor.webp",
  "financial-planner": "/images/chatsonic/financial-planner.webp",
  "xMail": "/images/chatsonic/xmail.webp",
  "wizard": "/images/chatsonic/wizard.webp",
};
