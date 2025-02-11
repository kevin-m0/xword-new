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
import Streampot from "@streampot/client"; // Import Streampot SDK
import fs from "fs/promises";
import path from "path";
// import fetch from "node-fetch";
import { handleCloudinaryUpload } from "~/lib/cloudinaryHelp";

export function extractScriptContent(xmlString: string): string {
  const scriptMatch = xmlString.match(/<script>([\s\S]*?)<\/script>/);
  return scriptMatch ? scriptMatch[1]?.trim() as string : "";
}

// export async function createVideoFromFrames(
//   frames: StoryboardFrame[],
// ): Promise<Blob> {
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d")!;
//   canvas.width = 1024;
//   canvas.height = 1024;

//   const audioContext = new AudioContext();
//   const audioDestination = audioContext.createMediaStreamDestination();
//   const videoStream = canvas.captureStream(30);

//   // Combine video and audio streams
//   const combinedStream = new MediaStream([
//     ...videoStream.getVideoTracks(),
//     ...audioDestination.stream.getAudioTracks(),
//   ]);

//   const mediaRecorder = new MediaRecorder(combinedStream, {
//     mimeType: "video/webm;codecs=vp8", // More compatible
//     videoBitsPerSecond: 5000000,
//   });

//   const chunks: Blob[] = [];
//   mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

//   // Load all frames first
//   const loadedFrames = await Promise.all(
//     frames.map(async (frame) => {
//       const image = await loadImage(frame.imageUrl);
//       const audioBuffer = await fetch(frame.audioUrl)
//         .then((response) => response.arrayBuffer())
//         .then((buffer) => audioContext.decodeAudioData(buffer))
//         .catch(() => {
//           // Fallback: create empty buffer if audio fetch fails
//           const buffer = audioContext.createBuffer(
//             2,
//             audioContext.sampleRate * 5,
//             audioContext.sampleRate,
//           );
//           return buffer;
//         });

//       return {
//         image,
//         audioBuffer,
//         subtitle: frame.subtitle,
//         duration: audioBuffer.duration,
//       };
//     }),
//   );

//   // Create a silent audio buffer for the delay
//   const delayDuration = 0.25;
//   const silentBuffer = audioContext.createBuffer(
//     2,
//     audioContext.sampleRate * delayDuration,
//     audioContext.sampleRate,
//   );

//   mediaRecorder.start();

//   // Process each frame
//   for (const frame of loadedFrames) {
//     // Draw image
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(frame.image, 0, 0, canvas.width, canvas.height);

//     // Draw subtitle
//     // function wrapText(ctx, text, maxWidth) {
//     //   const words = text.split(" ");
//     //   const lines = [];
//     //   let currentLine = "";

//     //   for (let i = 0; i < words.length; i++) {
//     //     const testLine = currentLine + words[i] + " ";
//     //     const { width } = ctx.measureText(testLine);
//     //     if (width > maxWidth && currentLine) {
//     //       lines.push(currentLine.trim());
//     //       currentLine = words[i] + " ";
//     //     } else {
//     //       currentLine = testLine;
//     //     }
//     //   }
//     //   lines.push(currentLine.trim());
//     //   return lines;
//     // }

//     // const maxWidth = canvas.width - 20; // Padding for better appearance
//     // const lines = wrapText(ctx, frame.subtitle, maxWidth);
//     // const lineHeight = 40; // Space between lines

//     // lines.forEach((line, index) => {
//     //   ctx.fillText(
//     //     line,
//     //     canvas.width / 2,
//     //     canvas.height - 90 + index * lineHeight,
//     //   );
//     // });

//     // Play audio
//     const audioSource = audioContext.createBufferSource();
//     audioSource.buffer = frame.audioBuffer;
//     audioSource.connect(audioDestination);
//     audioSource.start();

//     // Wait for audio to finish
//     await new Promise((resolve) => setTimeout(resolve, frame.duration * 1000));

//     // Add blank frame and silent audio for delay
//     const silentSource = audioContext.createBufferSource();
//     silentSource.buffer = silentBuffer;
//     silentSource.connect(audioDestination);
//     silentSource.start();

//     // Wait for delay duration
//     await new Promise((resolve) => setTimeout(resolve, delayDuration * 1000));
//   }

//   mediaRecorder.stop();

//   return new Promise((resolve) => {
//     mediaRecorder.onstop = () => {
//       const finalBlob = new Blob(chunks, { type: "video/webm" });
//       resolve(finalBlob);
//     };
//   });
// }

const streampot = new Streampot({
  secret: process.env.NEXT_PUBLIC_STREAMPOT_API_KEY as string,
});

interface Frame {
  imageUrl: string;
  audioUrl: string;
  subtitle?: string;
}

interface Frame {
  imageUrl: string;
  audioUrl: string;
}

interface VideoOutput {
  [key: string]: string;
}

export const createVideoFromFrames = async (
  frames: Frame[],
): Promise<string[]> => {
  try {
    // Validate input
    if (!frames?.length) {
      throw new Error("No frames provided");
    }

    // Process each frame in parallel to generate videos
    const frameVideos: string[] = await Promise.all(
      frames.map(async (frame, index) => {
        try {
          // Validate frame data
          if (!frame.imageUrl || !frame.audioUrl) {
            throw new Error(`Invalid frame data at index ${index}`);
          }

          const tempFileName = `frame-${index}-${Date.now()}.mp4`;

          const videoFromImage = await streampot
            .input(frame.imageUrl)
            .inputOption([
              "-loop",
              "1", // Enable image loop
              "-t",
              "9",
            ])
            .input(frame.audioUrl)
            .outputOptions([
              "-c:v",
              "libx264", // Video codec
              "-preset",
              "medium", // Encoding speed preset
              "-crf",
              "23", // Quality setting
              "-c:a",
              "aac", // Audio codec
              "-b:a",
              "128k", // Audio bitrate
              "-shortest", // Match shortest input duration
              "-pix_fmt",
              "yuv420p",
              "-movflags",
              "+faststart", // Enable fast start for web playback
            ])
            .output(tempFileName)
            .runAndWait();

          return videoFromImage.outputs[tempFileName] as string;
        } catch (error:any) {
          console.error(`Error processing frame ${index}:`, error);
          throw new Error(`Failed to process frame ${index}: ${error.message}`);
        }
      }),
    );

    // Filter out any failed frames
    const validVideos = frameVideos.filter(Boolean);

    if (validVideos.length === 0) {
      throw new Error("No valid video segments were created");
    }

    const videoUrls = await concatenateVideosWithAudio(validVideos);

    // Concatenate all valid videos
    return videoUrls;
  } catch (error) {
    console.error("Error in createVideoFromFrames:", error);
    throw error;
  }
};

const downloadVideo = async (url: string, index: number): Promise<string> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to download video from ${url}: ${response.statusText}`,
      );
    }

    // Create a local filename in the temp directory
    const tempDir = path.resolve("public", "temp");
    const localFileName = path.join(tempDir, `temp-video-${index}.mp4`);

    // Ensure the temp directory exists
    await fs.mkdir(tempDir, { recursive: true });

    // Write the file
    const buffer = await response.arrayBuffer();
    await fs.writeFile(localFileName, Buffer.from(buffer));

    console.log(`Downloaded and saved video to ${localFileName}`);
    return localFileName;
  } catch (error) {
    console.error(`Error downloading video from ${url}:`, error);
    throw error;
  }
};

const concatenateVideosWithAudio = async (
  frameVideos: string[],
): Promise<string[]> => {
  const downloadedFiles: string[] = [];

  try {
    // Download all videos
    const localFiles = await Promise.all(
      frameVideos.map((url, index) => downloadVideo(url, index)),
    );
    downloadedFiles.push(...localFiles);

    return localFiles;

    // let command = streampot; // Assuming streampot is already configured
    // const outputName = "final.mp4";

    // // Add all input files to the command
    // localFiles.forEach((file) => {
    //   command = command.input(file);
    // });

    // // Create complex filter array
    // const complexFilter = localFiles.map(
    //   (_, index) => `[${index}:v]scale=1920:1080,setsar=1[v${index}]`,
    // );
    // const scaledStreams = localFiles.map((_, index) => `[v${index}]`).join("");
    // complexFilter.push(`${scaledStreams}concat=n=${localFiles.length}:v=1:a=0`);

    // // Run the command and get the response
    // const response = await command
    //   .complexFilter(complexFilter)
    //   .output(outputName)
    //   .runAndWait();

    // console.log(`Videos successfully concatenated. Response:`, response);

    // // Retrieve the concatenated video URL
    // const outputUrl = response.outputs[0];
    // if (!outputUrl) {
    //   throw new Error("Failed to retrieve the concatenated video URL.");
    // }

    // console.log("Concatenated video available at:", outputUrl);

    // Cleanup temporary files
    // await Promise.all(
    //   downloadedFiles.map(async (file) => {
    //     try {
    //       await fs.unlink(file);
    //       console.log(`Temporary file deleted: ${file}`);
    //     } catch (cleanupError) {
    //       console.warn(
    //         `Failed to delete temporary file ${file}:`,
    //         cleanupError,
    //       );
    //     }
    //   }),
    // );
  } catch (error) {
    // Cleanup downloaded files in case of errors
    // await Promise.all(
    //   downloadedFiles.map(async (file) => {
    //     try {
    //       await fs.unlink(file);
    //       console.log(`Temporary file deleted: ${file}`);
    //     } catch (cleanupError) {
    //       console.warn(
    //         `Failed to delete temporary file ${file}:`,
    //         cleanupError,
    //       );
    //     }
    //   }),
    // );

    console.error("Error in concatenateVideosWithAudio:", error);
    throw error;
  }
};

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

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

// export const concatenateVideos = async (videoUrls: string[]) => {
//   // This will store cloudinary upload results for all videos subsequent to the first
//   const uploadedVideos = [];

//   // Upload result for all videos joined together
//   let finalVideoUploadResult;

//   console.log(videoUrls, "video urls passed to the function");

//   // Loop through all the uploaded videos
//   for (let i = 0; i < videoUrls.length; i++) {
//     const video = videoUrls[i];

//     // Check if it's the last video. In the end result this will actually be the first video
//     if (i === videoUrls.length - 1) {
//       // Upload the last video to Cloudinary, passing an array of public ids for the videos that will be joined together
//       const uploadResult = await handleCloudinaryUpload(
//         video,
//         uploadedVideos.map((video) => video.public_id.replaceAll("/", ":")),
//       );

//       finalVideoUploadResult = uploadResult;
//     } else {
//       // Upload the current video to Cloudinary
//       const uploadResult = await handleCloudinaryUpload(video);

//       // Add upload result to the end of the array of uploaded videos that will be joined together
//       uploadedVideos.push(uploadResult);
//     }
//   }

//   // Return the final concatenated video upload result
//   return finalVideoUploadResult;
// };

export const concatenateVideos = async (videoUrls: string[]) => {
  // Store cloudinary upload results for all videos except the last
  const uploadedVideos: { public_id: string }[] = [];
  let finalVideoUploadResult;

  console.log(videoUrls, "video urls passed to the function");

  // First, upload all videos except the first one
  for (let i = 1; i < videoUrls.length; i++) {
    const video = videoUrls[i];
    // Upload the current video to Cloudinary
    const uploadResult:any = await handleCloudinaryUpload(video as string);
    // Store the result correctly
    uploadedVideos.push({ public_id: uploadResult.public_id });
  }

  // Now upload the first video, passing the public IDs of subsequent videos
  if (videoUrls.length > 0) {
    finalVideoUploadResult = await handleCloudinaryUpload(
      videoUrls[0] as string,
      //@ts-ignore
      uploadedVideos.map((video) => video.public_id.replaceAll("/", ":")),
    );
  }

  return finalVideoUploadResult;
};


