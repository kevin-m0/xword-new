import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import axios from "axios";
import { getAwsUrl } from "@/app/(site)/(dashboard)/_lib/get-aws-url";

export const payloadSchemaWithMedia = z.object({
  appUserId: z.string(),
  text: z.string(),
  media: z.array(z.string()),
});

const fetchIGBusinessID = async (url: string, params: any) => {
  try {
    let body = {
      url: "https://graph.facebook.com/me/accounts",
      queryString: {
        fields:
          "category,access_token,name,id,tasks,instagram_business_account",
      },
      method: "GET",
      headers: {
        "x-pinc-response-data-at": "rows.0.data",
      },
    };

    const res = await axios.post(url, body, { params });

    const accounts = res.data.data;
    if (!accounts || accounts.length === 0) {
      return "No Facebook Pages Connected";
    }

    const igBusinessAccount = accounts[0]?.instagram_business_account?.id;
    return igBusinessAccount || "No IG Business Account Connected";
  } catch (error: any) {
    console.error(
      "Error fetching IG Business ID:",
      error.response?.data || error.message,
    );
    return "Error fetching IG Business Account";
  }
};

const createImagePost = async (
  url: string,
  params: any,
  igBusinessAccountID: string,
  photoUrl: string,
  text: string,
) => {
  try {
    const body = {
      url: `https://graph.facebook.com/${igBusinessAccountID}/media`,
      queryString: {
        media_type: "IMAGE",
        image_url: photoUrl,
        caption: text,
      },
      method: "POST",
      headers: {
        "x-pinc-response-data-at": "rows.0.data",
      },
    };
    const res = await axios.post(url, body, { params });
    return res.data;
  } catch (error: any) {
    console.error(
      "Error creating post:",
      error.response?.data || error.message,
    );
    return "Error creating post";
  }
};

const createReel = async (
  url: string,
  params: any,
  videoUrl: string,
  caption: string,
) => {
  const body = {
    url: "https://graph.facebook.com/<IG Business Account ID>/media",
    queryString: {
      media_type: "REELS",
      video_url: videoUrl,
      caption: caption,
    },
    method: "POST",
  };
  const res = await axios.post(url, body, { params });
  return res.data.id;
};

const createIGStory = async (
  url: string,
  params: any,
  igBusinessAccountID: string,
  photoUrl: string,
  text: string,
) => {
  try {
    const body = {
      url: `https://graph.facebook.com/${igBusinessAccountID}/media`,
      queryString: {
        media_type: "STORIES",
        image_url: photoUrl,
      },
      method: "POST",
      headers: {
        "x-pinc-response-data-at": "rows.0.data",
      },
    };
    const res = await axios.post(url, body, { params });
    return res.data;
  } catch (error: any) {
    console.error(
      "Error creating post:",
      error.response?.data || error.message,
    );
    return "Error creating post";
  }
};

//---------------!! CAROUSEL METHODS !!-------------
// get the id from this for each photo in the carousel
const createMediaIdForCarousel = async (
  url: string,
  params: any,
  photoUrl: string,
  igBusinessAccountID: string,
) => {
  const body = {
    url: `https://graph.facebook.com/${igBusinessAccountID}/media`,
    queryString: {
      is_carousel_item: true,
      media_type: "IMAGE",
      image_url: photoUrl,
    },
    method: "POST",
    headers: {
      "x-pinc-response-data-at": "rows.0.data",
    },
  };

  const res = await axios.post(url, body, { params });
  return res.data;
};

const createCarousel = async (
  url: string,
  params: any,
  mediaIDs: string[],
  caption: string,
  igBusinessAccountID: string,
) => {
  const body = {
    url: `https://graph.facebook.com/${igBusinessAccountID}/media`,
    queryString: {
      children: mediaIDs,
      media_type: "CAROUSEL",
      caption: caption,
    },
    method: "POST",
    headers: {
      "x-pinc-response-data-at": "rows.0.data",
    },
  };

  const res = await axios.post(url, body, { params });
  return res.data;
};

const publishCarousel = async (
  url: string,
  params: any,
  creationId: string,
  igBusinessAccountID: string,
) => {
  const body = {
    url: `https://graph.facebook.com/${igBusinessAccountID}/media_publish`,
    queryString: {
      creation_id: creationId,
    },
    method: "POST",
    headers: {
      "x-pinc-response-data-at": "rows.0.data",
    },
  };

  const res = await axios.post(url, body, { params });
  return res.data;
};
// ---------------!! CAROUSEL METHODS END HERE !!-------------

// for single image
export const postInstagramImagePost = schemaTask({
  id: "post-instagram-image-with-caption",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, text, media } = payload;

      const url = `https://labs.pathfix.com/oauth/method/iggraphapi/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      const igBusinessAccountID = await fetchIGBusinessID(url, params);

      const photoUrl = getAwsUrl(media[0] as string);

      const mediaId = await createImagePost(
        url,
        params,
        igBusinessAccountID,
        photoUrl as string,
        text,
      );

      const body = {
        url: `https://graph.facebook.com/${igBusinessAccountID}/media_publish`,
        queryString: {
          creation_id: mediaId,
        },
        method: "POST",
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

// for image carousel
export const postInstagramCarousel = schemaTask({
  id: "post-instagram-image-carousel",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, text, media } = payload;

      const mediaIds: string[] = [];

      const url = `https://labs.pathfix.com/oauth/method/iggraphapi/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      for (let photo of media) {
        const photoUrl = getAwsUrl(photo);
        const mediaId = await createMediaIdForCarousel(
          url,
          params,
          photoUrl as string,
          appUserId,
        );
        mediaIds.push(mediaId);
      }

      const creationId = await createCarousel(
        url,
        params,
        mediaIds,
        text,
        appUserId,
      );

      const res = await publishCarousel(url, params, creationId, appUserId);

      return res.data.id;
    } catch (error: any) {
      console.log(error);
    }
  },
});

// for instagram reels
export const postInstagramReel = schemaTask({
  id: "post-instagram-reel",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, text, media } = payload;

      const mediaIds: string[] = [];

      const url = `https://labs.pathfix.com/oauth/method/iggraphapi/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      const photoUrl = getAwsUrl(media[0] as string);
      const mediaId = await createMediaIdForCarousel(
        url,
        params,
        photoUrl as string,
        appUserId,
      );

      const creationId = await createCarousel(
        url,
        params,
        mediaIds,
        text,
        appUserId,
      );

      const res = await publishCarousel(url, params, creationId, appUserId);

      return res.data.id;
    } catch (error: any) {
      console.log(error);
    }
  },
});

export const postInstagramStory = schemaTask({
  id: "post-instagram-story",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, text, media } = payload;

      const mediaIds: string[] = [];

      const url = `https://labs.pathfix.com/oauth/method/iggraphapi/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      const photoUrl = getAwsUrl(media[0] as string);

      const mediaId = await createIGStory(
        url,
        params,
        appUserId,
        photoUrl as string,
        text,
      );

      const res = await publishCarousel(url, params, mediaId, appUserId);

      return res.data.id;
    } catch (error: any) {
      console.log(error);
    }
  },
});

//could be just two functions - one for single media and one for carousel. we need to find out whether a url is a video or an image
// and one for ig stories
