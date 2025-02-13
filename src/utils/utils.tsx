import { Editor } from "@tiptap/react";
import Cookies from "universal-cookie";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

// export function catchClerkError(err: unknown) {
//   const unknownError = "Something went wrong, please try again later.";

//   if (err instanceof z.ZodError) {
//     const errors = err.issues.map((issue) => {
//       return issue.message;
//     });
//     return toast(errors.join("\n"));
//   } else if (isClerkAPIResponseError(err)) {
//     return toast.custom((t) => (
//       <ErrorToast
//         t={t}
//         title="Authentication Error"
//         description={(err as any).errors[0]?.longMessage ?? unknownError}
//       />
//     ));
//   } else {
//     return toast.custom((t) => (
//       <ErrorToast
//         t={t}
//         title="Authentication Error"
//         description={unknownError}
//       />
//     ));
//   }
// }

export const getTruncatedText = (text: string, length: number) => {
  const truncatedText =
    text.length > length ? `${text.slice(0, length)}...` : text;
  return truncatedText.trimEnd();
};

export const cookies = new Cookies(null, { path: "/" });

const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
  "#C3E2C2",
  "#EAECCC",
  "#AFC8AD",
  "#EEC759",
  "#9BB8CD",
  "#FF90BC",
  "#FFC0D9",
  "#DC8686",
  "#7ED7C1",
  "#F3EEEA",
  "#89B9AD",
  "#D0BFFF",
  "#FFF8C9",
  "#CBFFA9",
  "#9BABB8",
  "#E3F4F4",
];

export const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

interface HandleLocalStorage {
  save: (key: string, content: any) => void;
  get: (key: string) => any;
}

const handleLocalStorage: HandleLocalStorage = {
  save: (key, content) => {
    try {
      const json = JSON.stringify(content);
      localStorage.setItem(key, json);
    } catch (error) {
      console.error(`Error saving to localStorage for key ${key}:`, error);
    }
  },

  get: (key) => {
    try {
      const content = localStorage.getItem(key);
      return content ? JSON.parse(content) : undefined;
    } catch (error) {
      console.error(
        `Error retrieving from localStorage for key ${key}:`,
        error,
      );
      return undefined;
    }
  },
};

/**
 * Saves the content of the editor to localStorage.
 * @param editor The editor instance.
 * @param documentId The unique identifier for the document.
 */
export const saveEditorContentToLocalStorage = (
  editor: Editor | undefined | null,
  documentId: string,
): void => {
  if (!editor || typeof documentId !== "string") {
    console.error("Invalid editor instance or document ID.");
    return;
  }
  const content = editor.getHTML();
  handleLocalStorage.save(documentId, content);
};

/**
 * Retrieves the editor content from localStorage.
 * @param documentId The unique identifier for the document.
 * @returns The editor content or undefined if not found or in case of an error.
 */
export const getEditorContentFromLocalStorage = (
  documentId: string,
): string | undefined => {
  if (typeof documentId !== "string") {
    console.error("Invalid document ID.");
    return;
  }
  return handleLocalStorage.get(documentId);
};

// Custom utility type to make specific properties required
export type MakeRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export function getNameInitials(fullName: string | undefined | null = "") {
  // Check if the input is not a string or is an empty string
  if (typeof fullName !== "string" || fullName.trim() === "") {
    return "";
  }

  // Split the full name into parts, filter out any empty parts that might occur with extra spaces
  const parts = fullName.trim().split(/\s+/);
  const initials = parts
    .map((part) => {
      // Check for non-empty part and return the uppercase initial
      if (part) {
        return part[0]?.toUpperCase();
      }
      return "";
    })
    .join("");

  return initials;
}

export function formatInputLabel(fieldLabel: string) {
  let newFieldLabel: string;
  if (fieldLabel.includes("_")) {
    newFieldLabel = fieldLabel
      .split("_")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  } else {
    newFieldLabel =
      fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1).toLowerCase();
  }

  return newFieldLabel;
}

export function formatInputType(fieldType: string) {
  const cleanedString = fieldType.slice(1, -1);
  return cleanedString.split(",").map((option) => option.trim());
}

export async function getRelatedKeyword(text: string): Promise<string> {
  const payload = {
    statement: text,
  };
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/generate-related-word`,
      payload,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export function stretchSize(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  const scaleX = targetWidth / originalWidth;
  const scaleY = targetHeight / originalHeight;
  const scale = Math.max(scaleX, scaleY);
  return [scale, scale];
}

export const captionPresets = [
  {
    mainTextStyle: {
      fontFamily: "The Alex Hormozi",
      fontSize: 96,
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    highlightedTextStyle: {
      fontFamily: "The Alex Hormozi",
      fontSize: 96,
      fontWeight: "bold",
      color: "#00FF00",
      strokeColor: "#000000",
      strokeThickness: 25,
      backgroundColor: "#FFFFFF",
      backgroundPadding: 10,
      backgroundCornerRadius: 20,
    },
    textMode: "full",
    highlightAnimation: "pop",
  },
  {
    mainTextStyle: {
      fontFamily: "Playfair Display",
      fontSize: 82,
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    highlightedTextStyle: {
      fontFamily: "Playfair Display",
      fontSize: 86,
      fontWeight: "bold",
      color: "#ADD8E6",
    },
    textMode: "full",
  },
  {
    mainTextStyle: {
      fontFamily: "Roboto",
      fontSize: 96,
      color: "#39FF14",
      fontWeight: "bold",
    },
    highlightedTextStyle: {
      fontFamily: "Roboto",
      fontSize: 96,
      fontWeight: "bold",
      color: "#007BFF",
      strokeColor: "#000000",
      strokeThickness: 15,
      backgroundColor: "#FFFFFF",
      backgroundPadding: 10,
      backgroundCornerRadius: 20,
    },
    textMode: "full",
    highlightAnimation: "pop",
  },
  {
    mainTextStyle: {
      fontFamily: "Poetsen One",
      fontSize: 96,
      color: "#FFFFFF",
      fontWeight: "bold",
      strokeColor: "#000000",
      strokeThickness: 15,
    },
    highlightedTextStyle: {
      fontFamily: "Poetsen One",
      fontSize: 96,
      fontWeight: "bold",
      color: "#FFFFFF",
      strokeColor: "#000000",
      strokeThickness: 15,
      backgroundColor: "#FF0000",
      backgroundPadding: 10,
      backgroundCornerRadius: 20,
    },
    textMode: "full",
    highlightAnimation: "pop",
  },
  {
    mainTextStyle: {
      fontFamily: "Lexend",
      fontSize: 96,
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    highlightedTextStyle: {
      fontFamily: "Lexend",
      fontSize: 96,
      fontWeight: "bold",
      color: "#FFA500",
      strokeColor: "#000000",
      strokeThickness: 15,
      backgroundColor: "#FFFFFF",
      backgroundPadding: 10,
      backgroundCornerRadius: 20,
    },
    textMode: "full",
    highlightAnimation: "pop",
  },
];

export function cleanScriptForTTS(rawScript: string): string {
  return (
    rawScript
      // Remove anything in square brackets: [ ... ]
      .replace(/\[[^\]]*\]/g, "")
      // Remove anything in parentheses: ( ... )
      .replace(/\([^)]*\)/g, "")
      // Remove 'Narrator:' (case-insensitive)
      .replace(/narrator:\s*/gi, "")
      // Remove all asterisks (*), even multiple
      .replace(/\*+/g, "")
      // Remove extra spaces
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}

export function generateShortTitle(audioText: string): string {
  const cleanText = cleanScriptForTTS(audioText);

  // Split text into sentences (assumes punctuation like ".", "!" or "?" marks end of a sentence)
  const sentences = cleanText.split(/(?<=[.!?])\s+/);

  // Heuristic: Use the first meaningful sentence as a title candidate
  const potentialTitle = sentences[0]?.trim();

  // If the first sentence is too long, truncate it to a reasonable length
  const maxTitleLength = 50; // Adjust this limit as needed
  if (potentialTitle && potentialTitle.length > maxTitleLength) {
    return `${potentialTitle.slice(0, maxTitleLength).trim()}...`;
  }

  // Fallback: Return a default title if the text is empty or invalid
  return potentialTitle || "Untitled Audio";
}

export function isValidYoutubeUrl(url: string) {
  const regex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&]{11})/;
  return regex.test(url);
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return response.text() as Promise<T>;
}

export const pollRequest = async (
  url: string,
  maxRetries: number = 1,
  delay: number = 60000,
): Promise<Response> => {
  let attempt = 0;

  const response = await fetch(url);

  if (response.ok) {
    return response; // Successful response (status 200)
  }

  const delayFor = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (attempt < maxRetries) {
    try {
      await delayFor(delay);
      const response = await fetch(url);
      console.log(response);
      if (response.ok) {
        return response; // Successful response (status 200)
      }
      console.log(`Attempt ${attempt + 1}: Received status ${response.status}`);
    } catch (error) {
      console.error(`Attempt ${attempt + 1}: Request failed`, error);
    }

    attempt++;
    if (attempt < maxRetries) {
      await delayFor(delay); // Wait before the next attempt
    }
  }

  throw new Error(`Failed to get a 200 status after ${maxRetries} attempts.`);
};

export interface PollForProcessingVideoOptions {
  src: string;
}

export async function pollForProcessingVideo(
  options: PollForProcessingVideoOptions,
): Promise<boolean> {
  const { src } = options;
  try {
    await new Promise((resolve, reject) => {
      fetch(src).then((res) => {
        if (!res.ok) {
          reject(res);
          return;
        }
        resolve(res);
      });
    });
  } catch (e: any) {
    // Timeout for 200ms before trying to fetch again to avoid overwhelming requests

    if (e.status === 423) {
      await new Promise((resolve) => setTimeout(() => resolve(undefined), 200));
      return await pollForProcessingVideo(options);
    }
    return false;
  }
  return true;
}
