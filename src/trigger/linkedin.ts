import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import axios from "axios";
import { getAwsUrl } from "@/app/(site)/(dashboard)/_lib/get-aws-url";
import { videoUrlToBase64 } from "./youtube";

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

export const fetchUserURN: any = async (url: string, params: any) => {
  let body = {
    url: "https://api.linkedin.com/v2/userinfo",
    method: "GET",
    headers: {
      "X-Restli-Protocol-Version": "2.0.0",
    },
  };

  const res = await axios.post(url, body, { params });

  return res.data.rows[0].data.sub;
};

export const postLinkedInTextPost = schemaTask({
  id: "post-linkedin-text-only",
  schema: payloadSchema,
  run: async (payload) => {
    try {
      const { appUserId, text } = payload;

      const url = `https://labs.pathfix.com/oauth/method/linkedin/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

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
      return res.data;
    } catch (error: any) {
      console.log(error);
    }
  },
});

async function registerLinkedInUpload(url: string, params: any, URN: string) {
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
        supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
      },
    },
  };

  const res = await axios.post(url, body, { params });

  return {
    uploadURL:
      res.data.rows[0].data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl,
    assetId: res.data.rows[0].data.value.asset,
  };
}

export async function imageUrlToBase64(
  url: string,
): Promise<{ base64: string; contentType: string }> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const contentType = response.headers.get("content-type") || "image/png";

  return {
    base64: `${base64}`,
    contentType,
  };
}

async function uploadImageFileLinkedin(
  url: string,
  params: any,
  uploadURL: string,
  photoURL: string,
) {
  try {
    const { base64, contentType } = await imageUrlToBase64(photoURL);
    const body = {
      url: uploadURL,
      method: "PUT",
      payload: {
        files: [
          {
            content:
              "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",
            type: contentType,
          },
        ],
      },
    };
    const res = await axios.post(url, body, { params });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

async function registerLinkedInVideoUpload(
  url: string,
  params: any,
  URN: string,
) {
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
        fileSizeBytes: 1055736, //find the size of the video
      },
    },
  };

  const res = await axios.post(url, body, { params });

  console.log(res.data);
  console.log(res.data.rows[0].internalError);

  return {
    uploadURL: res.data.rows[0].data.value.uploadInstructions[0].uploadUrl,
    assetId: res.data.rows[0].data.value.video,
  };
}

async function checkUploadStatus(url: string, params: any, assetId: string) {
  assetId = assetId.replace("urn:li:digitalmediaAsset:", "");
  const body = {
    url: `https://api.linkedin.com/v2/assets/${assetId}`,
    method: "GET",
    headers: {
      "X-Restli-Protocol-Version": "2.0.0",
      "x-pinc-response-data-at": "rows.0.data",
    },
  };

  console.log(body.url);

  const res = await axios.post(url, body, { params });
  return res.data;
}

export const postLinkedInImagePost = schemaTask({
  id: "post-linkedin-image-with-caption",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, text, photo } = payload;

      const url = `https://labs.pathfix.com/oauth/method/linkedin/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      const userURN = await fetchUserURN(url, params);

      const { uploadURL, assetId } = await registerLinkedInUpload(
        url,
        params,
        userURN,
      );

      const photoUrl = getAwsUrl(photo);

      await uploadImageFileLinkedin(url, params, uploadURL, photoUrl as string);

      const status = checkUploadStatus(url, params, assetId);

      //@ts-ignore
      if (status.status === "AVAILABLE") {
        console.log("ready to be posted");
      }

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

      console.log(assetId);

      const res = await axios.post(url, body, { params });
      return status;
    } catch (error: any) {
      console.log(error);
    }
  },
});

export const postLinkedInCarouselPost = schemaTask({
  id: "post-linkedin-image-carousel",
  schema: payloadSchemaWithMediaMultiple,
  run: async (payload) => {
    try {
      const { appUserId, text, photos } = payload;

      const url = `https://labs.pathfix.com/oauth/method/linkedin/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      const userURN = await fetchUserURN(url, params);

      const { uploadURL, assetId } = await registerLinkedInUpload(
        url,
        params,
        userURN,
      );

      const mediaIds: string[] = [];

      for (const photo of photos) {
        const photoUrl = getAwsUrl(photo);
        const image_bin = await uploadImageFileLinkedin(
          url,
          params,
          uploadURL,
          photoUrl as string,
        );
        mediaIds.push(image_bin);
      }

      console.log(mediaIds);

      // const body = {
      //   url: "https://api.linkedin.com/v2/ugcPosts",
      //   method: "POST",
      //   payload: {
      //     author: `urn:li:person:${userURN}`,
      //     lifecycleState: "PUBLISHED",
      //     specificContent: {
      //       "com.linkedin.ugc.ShareContent": {
      //         shareCommentary: {
      //           text: text,
      //         },
      //         shareMediaCategory: "IMAGE",
      //         media: [
      //           {
      //             media: mediaIds,
      //             status: "READY",
      //           },
      //         ],
      //       },
      //     },
      //     visibility: {
      //       "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      //     },
      //   },
      // };

      // const res = await axios.post(url, body, { params });
      return mediaIds;
    } catch (error: any) {
      console.log(error);
    }
  },
});

async function processVideoFile(url: string): Promise<string[]> {
  // Step 1: Convert video file URL to base64
  const base64Data = await videoUrlToBase64(url);

  // Step 2: Split base64 data into chunks if necessary
  const chunks = splitBase64(base64Data);

  // Return chunks
  return chunks;
}

export function splitBase64(
  base64String: string,
  chunkSize: number = 4 * 1024 * 1024,
): string[] {
  const chunks = [];
  let startIndex = 0;
  while (startIndex < base64String.length) {
    const chunk = base64String.slice(startIndex, startIndex + chunkSize);
    chunks.push(chunk);
    startIndex += chunkSize;
  }
  return chunks;
}

export const postVideoChunks = async (
  uploadURL: string,
  chunk: string,
  params: any,
) => {
  const body = {
    url: uploadURL,
    method: "PUT",
    payload: {
      files: [
        {
          content: chunk,
          type: "video/mp4",
        },
      ],
    },
    headers: {
      "X-Restli-Protocol-Version": "2.0.0",
      "x-payload-type": "file",
    },
  };
  await axios.post(uploadURL, body, { params });
};

export const postLinkedInVideoPost = schemaTask({
  id: "post-linkedin-video-with-caption",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, text, photo } = payload;

      const url = `https://labs.pathfix.com/oauth/method/linkedin/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      const userURN = await fetchUserURN(url, params);

      const { uploadURL, assetId } = await registerLinkedInVideoUpload(
        url,
        params,
        userURN,
      );
      console.log(photo, "videourl");

      const chunks = await processVideoFile(photo);

      for (const chunk of chunks) {
        await postVideoChunks(uploadURL, chunk, params);
      }

      const body = {
        url: "https://api.linkedin.com/rest/posts",
        method: "POST",
        headers: {
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202501",
          "Content-Type": "application/json",
        },
        payload: {
          author: userURN,
          commentary: text,
          visibility: "PUBLIC",
          distribution: {
            feedDistribution: "MAIN_FEED",
            targetEntities: [],
            thirdPartyDistributionChannels: [],
          },
          media: {
            title: "title of the video",
            id:
              "urn:li:video:" +
              assetId.replace("urn:li:digitalmediaAsset:", ""),
          },
          lifecycleState: "PUBLISHED",
          isReshareDisabledByAuthor: false,
        },
      };

      const res = await axios.post(url, body, { params });

      return res.data;
    } catch (error: any) {
      console.log(error);
    }
  },
});
