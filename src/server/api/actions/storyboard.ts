import fs from "fs/promises";
import path from "path";
import { handleCloudinaryUpload } from "~/lib/cloudinaryHelp";
import Streampot from "@streampot/client"; // Import Streampot SDK


const streampot = new Streampot({
    secret: process.env.NEXT_PUBLIC_STREAMPOT_API_KEY as string,
  });


  interface Frame {
    imageUrl: string;
    audioUrl: string;
    subtitle?: string;
  }

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


  export const downloadVideo = async (url: string, index: number): Promise<string> => {
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