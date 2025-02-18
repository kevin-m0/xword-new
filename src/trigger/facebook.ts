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
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
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
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      const photoUrl = getAwsUrl(photo);

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
  videoUrl: string,
) => {
  const body = {
    url: `https://graph.facebook.com/${pageId}/video_stories`,
    method: "POST",
    payload: {
      upload_phase: "start",
    },
    headers: {
      "x-pinc-response-data-at": "rows.0.data",
    },
  };

  const res = await axios.post(url, body, { params });

  return res.data.id;
};

export const postFacebookImageStory = schemaTask({
  id: "post-facebook-story-image",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, text, photo } = payload;

      const url = `https://labs.pathfix.com/oauth/method/facebook/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      const photoUrl = getAwsUrl(photo);

      const { accessToken, pageId } =
        await fetchFacebookPageAccessTokenAndPageId(url, params);

      const photoId = await uploadPhotoToFacebook(
        url,
        params,
        pageId,
        accessToken,
        photo,
      );

      const body = {
        url: "https://graph.facebook.com/v22.0/446092645264511/photo_stories",
        method: "POST",
        payload: {
          access_token: accessToken,
          photo_id: photoId,
        },
      };

      const res = await axios.post(url, body, { params });
      return res.data;
    } catch (error: any) {
      console.log(error);
    }
  },
});

// export const postFacebookVideoStory = schemaTask({
//   id: "post-facebook-video-story",
//   schema: payloadSchemaWithMedia,
//   run: async (payload) => {
//     try {
//       const { appUserId, text, photo } = payload;

//       const url = `https://labs.pathfix.com/oauth/method/facebook/call`;

//       // Prepare the request parameters
//       const params = {
//         user_id: appUserId,
//         public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
//         private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
//       };

//       const { accessToken, pageId } =
//         await fetchFacebookPageAccessTokenAndPageId(url, params);

//       const videoId = await uploadVideoForStoryToFacebook();

//       const body = {
//         url: "https://graph.facebook.com/v22.0/446092645264511/video_stories",
//         method: "POST",
//         payload: {
//           access_token: accessToken,
//           video_id: videoId,
//         },
//       };

//       const res = await axios.post(url, body, { params });
//       return res.data;
//     } catch (error: any) {
//       console.log(error);
//     }
//   },
// });

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
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
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
