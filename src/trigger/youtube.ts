import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import axios from "axios";
import fs from "fs";
import https from "https";

export const payloadSchemaWithMedia = z.object({
  appUserId: z.string(),
  title: z.string(),
  description: z.string(),
  videoUrl: z.string(),
});

const fetchUploadURL = async (
  url: string,
  params: any,
  title: string,
  description: string,
) => {
  const body = {
    url: "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status&alt=json",
    method: "MULTIPART-FORM",
    payload: {
      contentPart1: {
        content: {
          snippet: {
            title: title,
            description: description,
          },
          status: {
            privacyStatus: "public",
          },
        },
        contentType: "application/json",
      },
    },
  };

  const res = await axios.post(url, body, { params });

  return res.data.rows[0].headers.Location;
};

const uploadPart = (
  url: string,
  filePath: string,
  startByte: number,
  endByte: number,
  partNumber: number,
) => {
  const fileStream = fs.createReadStream(filePath, {
    start: startByte,
    end: endByte,
  });
  const options = {
    method: "PUT",
    headers: {
      "Content-Length": endByte - startByte + 1,
      "Content-Type": "video/mp4",
    },
  };

  const req = https.request(url, options, (res: any) => {
    if (res.statusCode === 200) {
      console.log(`Part ${partNumber} uploaded successfully`);
    } else {
      console.error(`Failed to upload part ${partNumber}`);
    }
  });

  fileStream.pipe(req);
};

const uploadFileInParts = (videoUrl: string, filePath: string) => {
  const fileSize = fs.statSync(filePath).size;
  const partSize = 5 * 1024 * 1024; // 5 MB per part
  let partNumber = 1;

  for (let startByte = 0; startByte < fileSize; startByte += partSize) {
    const endByte = Math.min(startByte + partSize - 1, fileSize - 1);
    const partUrl = `${videoUrl}?partNumber=${partNumber}`; // Example for getting part-specific URL
    uploadPart(partUrl, filePath, startByte, endByte, partNumber);
    partNumber++;
  }
};

export async function videoUrlToBase64(videoUrl: string): Promise<string> {
  try {
    const response = await axios.get(videoUrl, {
      responseType: "arraybuffer", // Ensures binary data
    });

    const base64String = Buffer.from(response.data).toString("base64");

    return base64String;
  } catch (error) {
    console.error("Error downloading video:", error);
    throw error;
  }
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

      const uploadURL = await fetchUploadURL(url, params, title, description);

      const base64Video = await videoUrlToBase64(videoUrl);

      // let body = {
      //   url: uploadURL,
      //   method: "PUT",
      // };

      const res = uploadFileInParts(videoUrl, videoUrl);

      return res;
    } catch (error: any) {
      console.log(error);
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
                privacyStatus: "unlisted",
              },
            },
            contentType: "application/json",
          },
          contentPart0: {
            content: base64Video, // Now it's correctly awaited
            contentType: "video/mp4",
          },
        },
      };

      // Make a POST request to the Pathfix API
      const res = await axios.post(url, body, { params });

      return res.data;
    } catch (error: any) {
      console.log(error);
    }
  },
});
