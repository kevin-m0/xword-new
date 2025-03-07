import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import axios from "axios";
import { getAwsUrl } from "~/lib/get-aws-url";

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

export const fetchFacebookPageAccessTokenAndPageId: any = async (
  url: string,
  params: any,
) => {
  let body = {
    url: "https://graph.facebook.com/me/accounts",
    method: "GET",
  };

  const res = await axios.post(url, body, { params });

  return {
    accessToken: res.data.rows[0].data.data[0].access_token,
    pageId: res.data.rows[0].data.data[0].id,
  };
};

export const postFacebookTextPost = schemaTask({
  id: "post-facebook-text-only",
  schema: payloadSchema,
  run: async (payload) => {
    try {
      const { appUserId, text } = payload;

      const url = `https://labs.pathfix.com/oauth/method/facebook/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
      };

      const { accessToken, pageId } =
        await fetchFacebookPageAccessTokenAndPageId(url, params);

      const body = {
        url: `https://graph.facebook.com/${pageId}/feed`,
        method: "FORM",
        payload: {
          message: text,
          access_token: accessToken,
        },
        headers: {
          "x-pinc-response-data-at": "rows.0.data",
        },
      };

      const res = await axios.post(url, body, { params });
      return res.data;
    } catch (error: any) {
      console.log(error);
    }
  },
});

export const postFacebookImagePost = schemaTask({
  id: "post-facebook-image-with-caption",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, text, photo } = payload;

      const url = `https://labs.pathfix.com/oauth/method/facebook/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
      };

      const photoUrl = photo;

      const { accessToken, pageId } =
        await fetchFacebookPageAccessTokenAndPageId(url, params);

      const body = {
        url: `https://graph.facebook.com/${pageId}/photos`,
        method: "POST",
        queryString: {
          caption: text,
          url: photoUrl,
          access_token: accessToken,
        },
        headers: {
          "x-pinc-response-data-at": "rows.0.data",
        },
      };

      const res = await axios.post(url, body, { params });
      return res.data;
    } catch (error: any) {
      console.log(error);
    }
  },
});

const uploadPhotoToFacebook = async (
  url: string,
  params: any,
  pageId: string,
  accessToken: string,
  photo: string,
) => {
  const body = {
    url: `https://graph.facebook.com/${pageId}/photos`,
    method: "POST",
    queryString: {
      url: photo,
      published: "false",
      access_token: accessToken,
    },
    headers: {
      "x-pinc-response-data-at": "rows.0.data",
    },
  };

  const res = await axios.post(url, body, { params });

  return res.data;
};

const uploadVideoForStoryToFacebook = async (
  url: string,
  params: any,
  pageId: string,
  accessToken: string,
) => {
  const body = {
    url: `https://graph.facebook.com/${pageId}/video_stories`,
    method: "POST",
    payload: {
      upload_phase: "start",
      access_token: accessToken,
    },
    headers: {
      "x-pinc-response-data-at": "rows.0.data",
    },
  };

  const res = await axios.post(url, body, { params });

  console.log(res.data, "videoId & uploadurl");

  return {
    videoId: res.data.video_id,
    uploadUrl: res.data.upload_url,
  };
};

const checkIfPhotoIsReady = async (
  url: string,
  params: any,
  accessToken: string,
  photoId: string,
) => {
  const body = {
    url: `https://graph.facebook.com/v22.0/${photoId}`,
    method: "GET",
    payload: {
      access_token: accessToken,
    },
  };

  const res = await axios.post(url, body, { params });

  return res.data;
};

export const postFacebookStory = schemaTask({
  id: "post-facebook-story",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, photo } = payload;

      const url = `https://labs.pathfix.com/oauth/method/facebook/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
      };

      let photoRes = await fetch(photo);

      const mtype = photoRes.headers.get("content-type");

      const { accessToken, pageId } =
        await fetchFacebookPageAccessTokenAndPageId(url, params);

      if (mtype?.includes("video")) {
        const { videoId, uploadUrl } = await uploadVideoForStoryToFacebook(
          url,
          params,
          pageId,
          accessToken,
        );

        const body = {
          url: `https://rupload.facebook.com/video-upload/v22.0/${videoId}`,
          method: "POST",
          payload: {
            file_url: photo,
            access_token: accessToken,
          },
        };

        console.log(body, "body");

        const res2 = await axios.post(url, body, { params });

        console.log(res2.data.rows[0].internalError, "res2");

        for (let i = 0; i < 50; i++) {
          const res = await axios.post(
            `https://graph.facebook.com/v22.0/${videoId}/fields=status`,
            { params },
          );
          console.log(res.data.rows[0].data, "res.data");
          if (res.data.rows[0].data.video_status === "ready") {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        // const finalBody = {
        //   url: `https://graph.facebook.com/v22.0/${pageId}/video_stories`,
        //   method: "POST",
        //   payload: {
        //     access_token: accessToken,
        //     video_id: videoId,
        //     upload_phase: "finish",
        //   },
        // };

        // console.log(finalBody, "finalBody");

        // const finalRes = await axios.post(url, finalBody, { params });
        // return finalRes.data;
      } else if (mtype?.includes("image")) {
        const photoId = await uploadPhotoToFacebook(
          url,
          params,
          pageId,
          accessToken,
          photo,
        );

        const readyOrNot = await checkIfPhotoIsReady(
          url,
          params,
          accessToken,
          photoId.id,
        );

        const body = {
          url: `https://graph.facebook.com/v22.0/${pageId}/photo_stories`,
          method: "POST",
          payload: {
            access_token: accessToken,
            photo_id: photoId.id,
          },
        };

        const res = await axios.post(url, body, { params });
        console.log(res.data);
        return res.data;
      }
    } catch (error: any) {
      console.log(error);
    }
  },
});

export const postFacebookMultipleImagePost = schemaTask({
  id: "post-facebook-image-multiple",
  schema: payloadSchemaWithMediaMultiple,
  run: async (payload) => {
    try {
      const { appUserId, text, photos } = payload;

      const url = `https://labs.pathfix.com/oauth/method/facebook/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
      };

      const { accessToken, pageId } =
        await fetchFacebookPageAccessTokenAndPageId(url, params);

      const mediaIds: string[] = [];

      for (let photo of photos) {
        const photoUrl = getAwsUrl(photo);
        const photoId = await uploadPhotoToFacebook(
          url,
          params,
          pageId,
          accessToken,
          photoUrl as string,
        );
        mediaIds.push(photoId.id);
      }

      const attachedMedia = mediaIds.map((id) => ({ media_fbid: id }));

      // Prepare request body
      const body = {
        url: `https://graph.facebook.com/${pageId}/feed`,
        method: "POST",
        queryString: {
          message: text, // Use the dynamic message
          access_token: accessToken,
          attached_media: attachedMedia,
        },
        headers: {
          "x-pinc-response-data-at": "rows.0.data",
        },
      };

      const res = await axios.post(url, body, { params });
      return attachedMedia;
    } catch (error: any) {
      console.log(error);
    }
  },
});
