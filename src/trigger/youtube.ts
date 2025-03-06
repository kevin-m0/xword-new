import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import axios from "axios";

export const payloadSchemaWithMedia = z.object({
  appUserId: z.string(),
  title: z.string(),
  description: z.string(),
  videoUrl: z.string(),
});

// Function to initiate a resumable upload session and get the upload URL
const fetchUploadURL = async (
  url: string,
  params: any,
  title: string,
  description: string,
) => {
  const body = {
    url: "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status&alt=json",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Upload-Content-Type": "video/mp4",
    },
    payload: {
      snippet: {
        title: title,
        description: description,
      },
      status: {
        privacyStatus: "public",
      },
    },
  };

  const res = await axios.post(url, body, { params });

  // Extract the upload URL from the response
  if (
    res.data &&
    res.data.rows &&
    res.data.rows[0] &&
    res.data.rows[0].headers &&
    res.data.rows[0].headers.Location
  ) {
    return res.data.rows[0].headers.Location;
  }

  throw new Error("Failed to get upload URL from response");
};

// Download video from URL to a buffer
async function downloadVideoToBuffer(videoUrl: string): Promise<Buffer> {
  console.log(`Downloading video from ${videoUrl}...`);

  const response = await axios({
    method: "GET",
    url: videoUrl,
    responseType: "arraybuffer",
  });

  return Buffer.from(response.data);
}

// Upload video in chunks to the specified URL
async function uploadVideoInChunks(
  uploadUrl: string,
  videoBuffer: Buffer,
): Promise<any> {
  const totalSize = videoBuffer.length;
  console.log(`Total video size: ${totalSize} bytes`);

  // Chunk size must be a multiple of 256KB (262144 bytes)
  const CHUNK_SIZE = 262144 * 8; // 2MB
  let startByte = 0;

  while (startByte < totalSize) {
    // Calculate end byte for this chunk
    let endByte = Math.min(startByte + CHUNK_SIZE - 1, totalSize - 1);

    // Extract chunk from buffer
    const chunk = videoBuffer.slice(startByte, endByte + 1);

    console.log(`Uploading bytes ${startByte}-${endByte}/${totalSize}`);

    try {
      const response = await axios({
        method: "PUT",
        url: uploadUrl,
        headers: {
          "Content-Length": chunk.length,
          "Content-Range": `bytes ${startByte}-${endByte}/${totalSize}`,
          "Content-Type": "video/mp4",
        },
        data: chunk,
        validateStatus: (status) => status < 500, // Accept 308 responses
      });

      if (response.status === 308) {
        // Upload is incomplete, continue with next chunk
        if (response.headers.range) {
          const rangeHeader = response.headers.range;
          const matches = /bytes=0-(\d+)/.exec(rangeHeader);
          if (matches && matches[1]) {
            const lastByteReceived = parseInt(matches[1], 10);
            startByte = lastByteReceived + 1;
            console.log(
              `Server confirmed receipt of bytes up to ${lastByteReceived}`,
            );
          } else {
            startByte = endByte + 1;
          }
        } else {
          startByte = endByte + 1;
        }
      } else if (response.status === 200 || response.status === 201) {
        // Upload is complete
        console.log("Upload completed successfully!");
        return response.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading chunk:", error);

      // Check upload status to determine where to resume
      try {
        const statusResponse = await axios({
          method: "PUT",
          url: uploadUrl,
          headers: {
            "Content-Range": `bytes */${totalSize}`,
            "Content-Length": "0",
          },
          validateStatus: (status) => status < 500,
        });

        if (statusResponse.headers.range) {
          const rangeHeader = statusResponse.headers.range;
          const matches = /bytes=0-(\d+)/.exec(rangeHeader);
          if (matches && matches[1]) {
            const lastByteReceived = parseInt(matches[1], 10);
            startByte = lastByteReceived + 1;
            console.log(`Resuming upload from byte ${startByte}`);
          }
        }
      } catch (statusError) {
        console.error("Error checking upload status:", statusError);
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  throw new Error("Upload did not complete successfully");
}

export const postYoutubeVideo = schemaTask({
  id: "post-youtube-video",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, title, description, videoUrl } = payload;

      const url = `https://labs.pathfix.com/oauth/method/youtube/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      // 1. Get the upload URL
      const uploadURL = await fetchUploadURL(url, params, title, description);
      console.log("Got upload URL:", uploadURL);

      // 2. Download the video to buffer
      const videoBuffer = await downloadVideoToBuffer(videoUrl);

      // 3. Upload the video in chunks
      const result = await uploadVideoInChunks(uploadURL, videoBuffer);

      return result;
    } catch (error: any) {
      console.error("Error in postYoutubeVideo:", error);
      throw error;
    }
  },
});

export const postYoutubeShorts = schemaTask({
  id: "post-youtube-shorts",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, title, description, videoUrl } = payload;

      const url = `https://labs.pathfix.com/oauth/method/youtube/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      // Wait for the video to be fetched and converted
      const response = await axios.get(videoUrl, {
        responseType: "arraybuffer",
      });
      const base64Video = Buffer.from(response.data).toString("base64");

      // Define the request body after base64 conversion
      const body = {
        url: "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status&alt=json",
        method: "MULTIPART-FORM",
        payload: {
          contentPart1: {
            content: {
              snippet: {
                title: title,
                description: `${description} #Shorts`,
              },
              status: {
                privacyStatus: "public",
              },
            },
            contentType: "application/json",
          },
          contentPart0: {
            content: base64Video,
            contentType: "video/mp4",
          },
        },
      };

      // Make a POST request to the Pathfix API
      const res = await axios.post(url, body, { params });

      return res.data;
    } catch (error: any) {
      console.error("Error in postYoutubeShorts:", error);
      throw error;
    }
  },
});
