import {
  AudioGenerationResponse,
  ImageGenerationResponse,
  StoryboardApiResponse,
  StoryboardFrame,
  StoryboardFrames,
  StoryboardResponse,
  StoryboardStyle,
} from "~/types";
import { RateLimiter } from "./rateLimiter";
import { withRetry } from "./retry";
import { handleApiResponse } from "./utils";


// function loadImage(url: string): Promise<HTMLImageElement> {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => resolve(img);
//     img.onerror = reject;
//     img.src = url;
//   });
// }

export async function generateStoryboard(
  script: string,
  style: StoryboardStyle,
  onFrameGenerated: (frame: StoryboardFrame) => void,
): Promise<StoryboardResponse> {
  const response = await makeRequest<StoryboardApiResponse>(
    "generate/generate-storyboard-frames",
    {
      script,
      numberOfFrames: "10",
      style,
    },
  );

  const frames: StoryboardFrame[] = [];

  console.log(response, "response from generate storyboard frames");

  // Process each frame sequentially but update UI immediately when each frame is ready
  for (const frame of response.storyboard) {
    const [imageUrl, audioUrl] = await Promise.all([
      generateImage(frame.imagePrompt, style),
      generateAudioForFrame(frame.scriptPart),
    ]);

    const newFrame = {
      imageUrl,
      subtitle: frame.scriptPart,
      audioUrl,
      timestamp: frames.length * 5,
    };

    console.log(newFrame, "new frame");

    frames.push(newFrame);
    onFrameGenerated(newFrame); // Notify when each frame is ready
  }

  return {
    frames,
    success: true,
  };
}

const AUDIO_VOICE_ID = "71a7ad14-091c-4e8e-a314-022ece01c121";
const S3_AUDIO_BASE_URL = "https://xword.s3.ap-south-1.amazonaws.com";

async function generateAudioForFrame(subtitle: string): Promise<string> {
  const response = await makeRequest<AudioGenerationResponse>(
    "generate/audio/generate-audio",
    {
      userId: "meta-tester-1",
      transcript: subtitle,
      voiceId: AUDIO_VOICE_ID,
      speed: "normal",
      language: "en"
    },
  );

  return `${S3_AUDIO_BASE_URL}/${response.file}`;
}

const rateLimiter = new RateLimiter();

export async function generateImage(
  prompt: string,
  style: StoryboardStyle,
): Promise<string> {
  return rateLimiter.schedule(() =>
    withRetry(
      async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/image/generate-images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
              "Content-Type": "application/json",
              accept: "*/*",
            },
            body: JSON.stringify({
              model: "Flux",
              userId: "meta-tester-1",
              prompt,
              resolution: "1024x1024",
              artStyle: style,
              quantity: 1,
              negativePrompts: "",
              tags: [`${style}, Serene`],
              colors: ["red"],
            }),
          },
        );

        const data =
          await handleApiResponse<ImageGenerationResponse[]>(response);
        return `${S3_AUDIO_BASE_URL}/${data[0]?.file}`;
      },
      {
        maxAttempts: 3,
        delayMs: 2000,
        shouldRetry: (error) => error?.status === 429,
      },
    ),
  );
}

export async function makeRequest<T>(endpoint: string, body: any): Promise<T> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/${endpoint}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(body),
      },
    );

    return handleApiResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection.");
  }
}


