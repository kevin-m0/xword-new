import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import axios from "axios";
import { getAwsUrl } from "~/lib/get-aws-url";

// Define type interfaces
interface UserParams {
  user_id: string;
  public_key: string;
  private_key: string;
}

interface UploadResult {
  uploadURL: string;
  assetId: string;
}

interface ImageData {
  base64: string;
  contentType: string;
}

// Payload schemas
export const payloadSchema = z.object({
  appUserId: z.string(),
  text: z.string(),
});

export const payloadSchemaWithMedia = z.object({
  appUserId: z.string(),
  text: z.string(),
  photo: z.string(),
});

export const payloadSchemaWithMediaMultiple = z.object({
  appUserId: z.string(),
  text: z.string(),
  photos: z.array(z.string()),
});

export const fetchUserURN = async (
  url: string,
  params: UserParams,
): Promise<string> => {
  try {
    const body = {
      url: "https://api.linkedin.com/v2/userinfo",
      method: "GET",
      headers: {
        "X-Restli-Protocol-Version": "2.0.0",
      },
    };

    const res = await axios.post(url, body, { params });

    if (!res.data.rows || res.data.rows.length === 0) {
      throw new Error("User URN not found in response");
    }

    return res.data.rows[0].data.sub;
  } catch (error: any) {
    logger.error("Error fetching user URN", { error: error.message });
    throw new Error(`Failed to fetch LinkedIn user URN: ${error.message}`);
  }
};

export const postLinkedInTextPost = schemaTask({
  id: "post-linkedin-text-only",
  schema: payloadSchema,
  run: async (payload) => {
    try {
      const { appUserId, text } = payload;

      // Basic validation
      if (!text || text.trim() === "") {
        throw new Error("Post text cannot be empty");
      }

      if (!appUserId) {
        throw new Error("User ID is required");
      }

      logger.info("Posting text content to LinkedIn", { userId: appUserId });

      const url = `https://labs.pathfix.com/oauth/method/linkedin/call`;

      // Prepare the request parameters with environment variables
      const params: UserParams = {
        user_id: appUserId,
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY || "",
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY || "",
      };

      // Validate API keys
      if (!params.public_key || !params.private_key) {
        throw new Error("LinkedIn API keys are not configured");
      }

      const userURN = await fetchUserURN(url, params);

      const body = {
        url: "https://api.linkedin.com/v2/ugcPosts",
        method: "POST",
        payload: {
          author: `urn:li:person:${userURN}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: text,
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        },
      };

      const res = await axios.post(url, body, { params });
      logger.info("Successfully posted to LinkedIn", {
        userId: appUserId,
        postId: res.data?.id,
      });
      return res.data;
    } catch (error: any) {
      logger.error("LinkedIn API Error", {
        error: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to post to LinkedIn: ${error.message}`);
    }
  },
});

async function registerLinkedInUpload(
  url: string,
  params: UserParams,
  URN: string,
): Promise<UploadResult> {
  try {
    let body = {
      url: "https://api.linkedin.com/v2/assets?action=registerUpload",
      method: "POST",
      payload: {
        registerUploadRequest: {
          owner: `urn:li:person:${URN}`,
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          serviceRelationships: [
            {
              identifier: "urn:li:userGeneratedContent",
              relationshipType: "OWNER",
            },
          ],
        },
      },
    };

    const res = await axios.post(url, body, { params });

    if (
      !res.data.rows ||
      res.data.rows.length === 0 ||
      !res.data.rows[0].data?.value
    ) {
      throw new Error(
        "Invalid response from LinkedIn register upload endpoint",
      );
    }

    return {
      uploadURL:
        res.data.rows[0].data.value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl,
      assetId: res.data.rows[0].data.value.asset,
    };
  } catch (error: any) {
    logger.error("Error registering LinkedIn upload", { error: error.message });
    throw new Error(`Failed to register LinkedIn upload: ${error.message}`);
  }
}

export async function imageUrlToBase64(url: string): Promise<ImageData> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = response.headers.get("content-type") || "image/png";

    return {
      base64: `${base64}`,
      contentType,
    };
  } catch (error: any) {
    logger.error("Error converting image to base64", {
      error: error.message,
      url,
    });
    throw new Error(`Failed to convert image to base64: ${error.message}`);
  }
}

async function uploadImageFileLinkedin(
  url: string,
  params: UserParams,
  uploadURL: string,
  photoURL: string,
): Promise<string> {
  try {
    const { base64, contentType } = await imageUrlToBase64(photoURL);
    const body = {
      url: uploadURL,
      method: "PUT",
      payload: {
        files: [
          {
            content: base64,
            type: contentType,
          },
        ],
      },
    };

    console.log(body.payload.files);

    const res = await axios.post(url, body, { params });
    console.log(res.data, "did the image upload to linkedin");

    logger.info("Successfully uploaded image to LinkedIn", { contentType });
    return res.data;
  } catch (error: any) {
    logger.error("Error uploading image to LinkedIn", { error: error.message });
    throw new Error(`Failed to upload image to LinkedIn: ${error.message}`);
  }
}

async function checkUploadStatus(
  url: string,
  params: UserParams,
  assetId: string,
) {
  try {
    const cleanAssetId = assetId.replace("urn:li:digitalmediaAsset:", "");
    const body = {
      url: `https://api.linkedin.com/v2/assets/${cleanAssetId}`,
      method: "GET",
      headers: {
        "X-Restli-Protocol-Version": "2.0.0",
        "x-pinc-response-data-at": "rows.0.data",
      },
    };

    console.log(body, "body");
    console.log(url, "url");

    logger.info("Checking upload status", { assetId: cleanAssetId });
    const res = await axios.post(url, body, { params });
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    logger.error("Error checking upload status", {
      error: error.message,
      assetId,
    });
    throw new Error(`Failed to check upload status: ${error.message}`);
  }
}

export const postLinkedInImagePost = schemaTask({
  id: "post-linkedin-image-with-caption",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, text, photo } = payload;

      // Basic validation
      if (!text || text.trim() === "") {
        throw new Error("Post text cannot be empty");
      }

      if (!appUserId) {
        throw new Error("User ID is required");
      }

      if (!photo) {
        throw new Error("Photo URL is required");
      }

      const url = `https://labs.pathfix.com/oauth/method/linkedin/call`;

      // Prepare the request parameters with environment variables
      const params: UserParams = {
        user_id: appUserId,
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY || "",
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY || "",
      };

      // Validate API keys
      if (!params.public_key || !params.private_key) {
        throw new Error("LinkedIn API keys are not configured");
      }

      const userURN = await fetchUserURN(url, params);

      const { uploadURL, assetId } = await registerLinkedInUpload(
        url,
        params,
        userURN,
      );

      const photoUrl = photo;

      if (!photoUrl) {
        throw new Error("Failed to get valid photo URL");
      }

      await uploadImageFileLinkedin(url, params, uploadURL, photoUrl as string);

      // Wait for the asset to be processed
      // let status;
      // let attempts = 0;
      // const maxAttempts = 5;

      // do {
      //   status = await checkUploadStatus(url, params, assetId);
      //   if (status.status !== "AVAILABLE") {
      //     await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      //     logger.info("Waiting for image processing", {
      //       attempt: attempts + 1,
      //       status: status.status,
      //     });
      //   }
      //   attempts++;
      // } while (status.status !== "AVAILABLE" && attempts < maxAttempts);

      // if (status.status !== "AVAILABLE") {
      //   throw new Error("Media upload processing timeout");
      // }

      // logger.info("Image ready for posting", { assetId });

      const body = {
        url: "https://api.linkedin.com/v2/ugcPosts",
        method: "POST",
        payload: {
          author: `urn:li:person:${userURN}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: text,
              },
              shareMediaCategory: "IMAGE",
              media: [
                {
                  media: assetId,
                  status: "READY",
                },
              ],
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        },
      };

      const res = await axios.post(url, body, { params });
      logger.info("Successfully posted image to LinkedIn", {
        userId: appUserId,
        postId: res.data?.id,
      });
      return res.data;
    } catch (error: any) {
      logger.error("LinkedIn API Error", {
        error: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to post image to LinkedIn: ${error.message}`);
    }
  },
});

export const postLinkedInCarouselPost = schemaTask({
  id: "post-linkedin-image-carousel",
  schema: payloadSchemaWithMediaMultiple,
  run: async (payload) => {
    try {
      const { appUserId, text, photos } = payload;

      // Basic validation
      if (!text || text.trim() === "") {
        throw new Error("Post text cannot be empty");
      }

      if (!appUserId) {
        throw new Error("User ID is required");
      }

      if (!photos || photos.length === 0) {
        throw new Error("At least one photo is required");
      }

      if (photos.length > 10) {
        throw new Error("LinkedIn allows a maximum of 10 images in a carousel");
      }

      logger.info("Posting carousel content to LinkedIn", {
        userId: appUserId,
        photoCount: photos.length,
      });

      const url = `https://labs.pathfix.com/oauth/method/linkedin/call`;

      // Prepare the request parameters with environment variables
      const params: UserParams = {
        user_id: appUserId,
        public_key: process.env.LINKEDIN_PUBLIC_KEY || "",
        private_key: process.env.LINKEDIN_PRIVATE_KEY || "",
      };

      // Validate API keys
      if (!params.public_key || !params.private_key) {
        throw new Error("LinkedIn API keys are not configured");
      }

      const userURN = await fetchUserURN(url, params);
      const mediaItems = [];

      // Process each photo
      for (const photo of photos) {
        const { uploadURL, assetId } = await registerLinkedInUpload(
          url,
          params,
          userURN,
        );

        const photoUrl = photo;

        if (!photoUrl) {
          throw new Error(`Failed to get valid photo URL for ${photo}`);
        }

        await uploadImageFileLinkedin(
          url,
          params,
          uploadURL,
          photoUrl as string,
        );

        // Wait for the asset to be processed
        // let status;
        // let attempts = 0;
        // const maxAttempts = 5;

        // do {
        //   status = await checkUploadStatus(url, params, assetId);
        //   if (status.status !== "AVAILABLE") {
        //     await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        //     logger.info("Waiting for image processing", {
        //       attempt: attempts + 1,
        //       status: status.status,
        //     });
        //   }
        //   attempts++;
        // } while (status.status !== "AVAILABLE" && attempts < maxAttempts);

        // if (status.status !== "AVAILABLE") {
        //   throw new Error(
        //     `Media upload processing timeout for image: ${photo}`,
        //   );
        // }

        mediaItems.push({
          media: assetId,
          status: "READY",
        });
      }

      logger.info("All images ready for carousel posting", {
        count: mediaItems.length,
      });

      const body = {
        url: "https://api.linkedin.com/v2/ugcPosts",
        method: "POST",
        payload: {
          author: `urn:li:person:${userURN}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: text,
              },
              shareMediaCategory: "CAROUSEL",
              media: mediaItems,
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        },
      };

      const res = await axios.post(url, body, { params });
      logger.info("Successfully posted carousel to LinkedIn", {
        userId: appUserId,
        postId: res.data?.id,
      });
      return res.data;
    } catch (error: any) {
      logger.error("LinkedIn API Error", {
        error: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to post carousel to LinkedIn: ${error.message}`);
    }
  },
});

async function registerLinkedInVideoUpload(
  url: string,
  params: UserParams,
  URN: string,
  videoFileSize: number,
): Promise<UploadResult> {
  try {
    const body = {
      url: "https://api.linkedin.com/rest/videos?action=initializeUpload",
      method: "POST",
      headers: {
        "LinkedIn-Version": "202501",
        "X-RestLi-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
      payload: {
        initializeUploadRequest: {
          owner: `urn:li:person:${URN}`,
          fileSizeBytes: videoFileSize, // This needs to be the actual file size
        },
      },
    };

    const res = await axios.post(url, body, { params });

    if (res.data.rows?.[0]?.internalError) {
      throw new Error(
        `LinkedIn API error: ${JSON.stringify(res.data.rows[0].internalError)}`,
      );
    }

    if (!res.data.rows || !res.data.rows[0]?.data?.value) {
      throw new Error(
        "Invalid response from LinkedIn video upload initialization",
      );
    }

    return {
      uploadURL: res.data.rows[0].data.value.uploadInstructions[0].uploadUrl,
      assetId: res.data.rows[0].data.value.video,
    };
  } catch (error: any) {
    logger.error("Error registering LinkedIn video upload", {
      error: error.message,
    });
    throw new Error(
      `Failed to register LinkedIn video upload: ${error.message}`,
    );
  }
}

async function getVideoFileSize(url: string): Promise<number> {
  try {
    const response = await fetch(url, { method: "HEAD" });

    if (!response.ok) {
      throw new Error(
        `Failed to get video file size: ${response.status} ${response.statusText}`,
      );
    }

    const contentLength = response.headers.get("content-length");

    if (!contentLength) {
      throw new Error("Content-Length header not found");
    }

    return parseInt(contentLength, 10);
  } catch (error: any) {
    logger.error("Error getting video file size", { error: error.message });
    throw new Error(`Failed to get video file size: ${error.message}`);
  }
}

async function videoUrlToArrayBuffer(url: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch video: ${response.status} ${response.statusText}`,
      );
    }

    return await response.arrayBuffer();
  } catch (error: any) {
    logger.error("Error converting video to array buffer", {
      error: error.message,
    });
    throw new Error(
      `Failed to convert video to array buffer: ${error.message}`,
    );
  }
}

export function splitArrayBuffer(
  buffer: ArrayBuffer,
  chunkSize: number = 4 * 1024 * 1024,
): ArrayBuffer[] {
  const chunks: ArrayBuffer[] = [];
  let offset = 0;

  while (offset < buffer.byteLength) {
    const size = Math.min(chunkSize, buffer.byteLength - offset);
    chunks.push(buffer.slice(offset, offset + size));
    offset += size;
  }

  return chunks;
}

async function uploadVideoChunk(
  url: string,
  params: UserParams,
  uploadURL: string,
  chunk: ArrayBuffer,
  contentType: string,
): Promise<void> {
  try {
    // Convert to base64 for transport
    const base64 = Buffer.from(chunk).toString("base64");

    const body = {
      url: uploadURL,
      method: "PUT",
      payload: {
        files: [
          {
            content: base64,
            type: contentType,
          },
        ],
      },
      headers: {
        "X-Restli-Protocol-Version": "2.0.0",
      },
    };

    const res = await axios.post(url, body, { params });
    logger.info("Successfully uploaded video chunk", {
      size: chunk.byteLength,
    });
  } catch (error: any) {
    logger.error("Error uploading video chunk", { error: error.message });
    throw new Error(`Failed to upload video chunk: ${error.message}`);
  }
}

async function processVideoFile(
  url: string,
  videoUrl: string,
): Promise<{ chunks: ArrayBuffer[]; contentType: string }> {
  try {
    // Get content type
    const headResponse = await fetch(videoUrl, { method: "HEAD" });
    const contentType = headResponse.headers.get("content-type") || "video/mp4";

    // Download video
    const arrayBuffer = await videoUrlToArrayBuffer(videoUrl);

    // Split into chunks
    const chunks = splitArrayBuffer(arrayBuffer);

    return { chunks, contentType };
  } catch (error: any) {
    logger.error("Error processing video file", { error: error.message });
    throw new Error(`Failed to process video file: ${error.message}`);
  }
}

export const postLinkedInVideoPost = schemaTask({
  id: "post-linkedin-video-with-caption",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, text, photo: videoUrl } = payload;

      // Basic validation
      if (!text || text.trim() === "") {
        throw new Error("Post text cannot be empty");
      }

      if (!appUserId) {
        throw new Error("User ID is required");
      }

      if (!videoUrl) {
        throw new Error("Video URL is required");
      }

      logger.info("Posting video content to LinkedIn", { userId: appUserId });

      const url = `https://labs.pathfix.com/oauth/method/linkedin/call`;

      // Prepare the request parameters with environment variables
      const params: UserParams = {
        user_id: appUserId,
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY || "",
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY || "",
      };

      // Validate API keys
      if (!params.public_key || !params.private_key) {
        throw new Error("LinkedIn API keys are not configured");
      }

      const userURN = await fetchUserURN(url, params);

      // Get video URL from AWS or use directly
      const videoFullUrl = videoUrl;

      if (!videoFullUrl) {
        throw new Error("Failed to get valid video URL");
      }

      // Get video file size for the API request
      const fileSize = await getVideoFileSize(videoFullUrl);

      // Register the upload with LinkedIn
      const { uploadURL, assetId } = await registerLinkedInVideoUpload(
        url,
        params,
        userURN,
        fileSize,
      );

      // Process and upload the video
      const { chunks, contentType } = await processVideoFile(url, videoFullUrl);

      // Upload each chunk
      for (let i = 0; i < chunks.length; i++) {
        logger.info(`Uploading video chunk ${i + 1} of ${chunks.length}`);
        await uploadVideoChunk(
          url,
          params,
          uploadURL,
          chunks[i] as ArrayBuffer,
          contentType,
        );
      }

      // Wait for processing to complete
      // let status;
      // let attempts = 0;
      // const maxAttempts = 10; // Video might take longer to process

      // do {
      //   status = await checkUploadStatus(url, params, assetId);
      //   if (status.status !== "AVAILABLE") {
      //     // Wait longer for video
      //     await new Promise((resolve) => setTimeout(resolve, 5000));
      //     logger.info("Waiting for video processing", {
      //       attempt: attempts + 1,
      //       status: status.status,
      //     });
      //   }
      //   attempts++;
      // } while (status.status !== "AVAILABLE" && attempts < maxAttempts);

      // if (status.status !== "AVAILABLE") {
      //   throw new Error("Video upload processing timeout");
      // }

      // logger.info("Video ready for posting", { assetId });

      // Post with video
      const body = {
        url: "https://api.linkedin.com/rest/videos?action=finalizeUpload",
        method: "POST",
        headers: {
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202501",
          "Content-Type": "application/json",
        },
        payload: {
          finalizeUploadRequest: {
            video: `urn:li:video:${assetId}`,
            uploadToken: "",
            uploadedPartIds: [
              //etags of the video chunks
            ],
          },
        },
      };

      const res = await axios.post(url, body, { params });
      console.log(res.data.rows[0].internalError);
      console.log(res.data, "done dona done");
      logger.info("Successfully posted video to LinkedIn", {
        userId: appUserId,
        postId: res.data?.id,
      });
      return res.data;
    } catch (error: any) {
      logger.error("LinkedIn API Error", {
        error: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to post video to LinkedIn: ${error.message}`);
    }
  },
});
