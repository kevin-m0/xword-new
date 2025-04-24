import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import axios from "axios";
import { getAwsUrl } from "~/lib/get-aws-url";
import { fetchFacebookPageAccessTokenAndPageId } from "./facebook";

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
  igBusinessAccountID: string,
) => {
  const body = {
    url: `https://graph.facebook.com/${igBusinessAccountID}/media`,
    queryString: {
      media_type: "REELS",
      video_url: videoUrl,
      caption: caption,
    },
    method: "POST",
  };
  const res = await axios.post(url, body, { params });

  return res.data;
};

const createIGImageStory = async (
  url: string,
  params: any,
  igBusinessAccountID: string,
  photoUrl: string,
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

const createIGVideoStory = async (
  url: string,
  params: any,
  igBusinessAccountID: string,
  videoUrl: string,
) => {
  console.log(videoUrl, "videoUrl");
  console.log(igBusinessAccountID, "igBusinessAccountID");
  try {
    const body = {
      url: `https://graph.facebook.com/${igBusinessAccountID}/media`,
      queryString: {
        media_type: "STORIES",
        video_url: videoUrl,
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
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
      };

      const igBusinessAccountID = await fetchIGBusinessID(url, params);

      if (igBusinessAccountID === "No IG Business Account Connected") {
        return "No IG Business Account Connected";
      }

      const photoUrl = media[0] as string;

      console.log(photoUrl);

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
          creation_id: mediaId.id,
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
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
      };

      const igBusinessAccountID = await fetchIGBusinessID(url, params);

      for (let photo of media) {
        const photoUrl = photo;
        const mediaId = await createMediaIdForCarousel(
          url,
          params,
          photoUrl as string,
          igBusinessAccountID,
        );
        mediaIds.push(mediaId.id);
      }
      console.log(mediaIds, "mediaIds");

      const creationId = await createCarousel(
        url,
        params,
        mediaIds,
        text,
        igBusinessAccountID,
      );

      const res = await publishCarousel(
        url,
        params,
        creationId.id,
        igBusinessAccountID,
      );

      return res.data;
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

      const url = `https://labs.pathfix.com/oauth/method/iggraphapi/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
      };

      const igBusinessAccountID = await fetchIGBusinessID(url, params);

      const videoUrl = media[0] as string;

      const creationId = await createReel(
        url,
        params,
        videoUrl,
        text,
        igBusinessAccountID,
      );

      const containerIsReady = await checkContainerIsReady(
        url,
        params,
        creationId.rows[0].data.id,
      );

      if (!containerIsReady) {
        return "Container is not ready";
      }

      const res = await publishCarousel(
        url,
        params,
        creationId.rows[0].data.id,
        igBusinessAccountID,
      );

      return res.data;
    } catch (error: any) {
      console.log(error);
    }
  },
});

const checkContainerIsReady = async (
  url: string,
  params: any,
  mediaId: string,
) => {
  const { accessToken } = await fetchFacebookPageAccessTokenAndPageId(
    url,
    params,
  );

  const body = {
    url: `https://graph.facebook.com/${mediaId}?fields=status_code&access_token=${accessToken}`,
    method: "GET",
  };

  for (let i = 0; i < 50; i++) {
    const res = await axios.post(url, body, { params });
    console.log(res.data.rows[0].data, "res.data");
    if (res.data.rows[0].data.status_code === "FINISHED") {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return false;
};

export const postInstagramStory = schemaTask({
  id: "post-instagram-story",
  schema: payloadSchemaWithMedia,
  run: async (payload) => {
    try {
      const { appUserId, media } = payload;

      const mediaIds: string[] = [];

      const url = `https://labs.pathfix.com/oauth/method/iggraphapi/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
        private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
      };

      const igBusinessAccountID = await fetchIGBusinessID(url, params);

      const photoUrl = media[0] as string;

      let photoRes = await fetch(photoUrl);

      const mtype = photoRes.headers.get("content-type");

      if (mtype?.includes("video")) {
        const mediaId = await createIGVideoStory(
          url,
          params,
          igBusinessAccountID,
          photoUrl,
        );
        const containerIsReady = await checkContainerIsReady(
          url,
          params,
          mediaId.id,
        );
        if (!containerIsReady) {
          return "Container is not ready";
        }
        const res = await publishCarousel(
          url,
          params,
          mediaId.id,
          igBusinessAccountID,
        );

        return res.data;
      } else if (mtype?.includes("image")) {
        const mediaId = await createIGImageStory(
          url,
          params,
          igBusinessAccountID,
          photoUrl,
        );
        const containerIsReady = await checkContainerIsReady(
          url,
          params,
          mediaId.id,
        );
        if (!containerIsReady) {
          return "Container is not ready";
        }
        const res = await publishCarousel(
          url,
          params,
          mediaId.id,
          igBusinessAccountID,
        );

        return res.data;
      }
    } catch (error: any) {
      console.log(error);
    }
  },
});

//could be just two functions - one for single media and one for carousel. we need to find out whether a url is a video or an image
// and one for ig stories
