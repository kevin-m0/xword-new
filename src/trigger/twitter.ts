import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import axios from "axios";

export const payloadSchema = z.object({
  appUserId: z.string(),
  tweet: z.string(),
  media: z.array(z.string()).optional(),
});

export const threadPayloadSchema = z.object({
  appUserId: z.string(),
  tweets: z.array(z.string()),
});

// async function uploadMediaToTwitter(media: string[], params: any) {

//   // const mediaIds: string[] = [];
//   // for (const mediaUrl of media) {
//   //   const photoUrl = getAwsUrl(mediaUrl);
//   //   const photoBase64 = await imageUrlToBase64(photoUrl as string);
//   //   const url = `https://upload.twitter.com/1.1/media/upload.json?media_category=tweet_image&media_data=${photoBase64.base64}`;

//   //   const res = await axios.post(url, { params });
//   //   mediaIds.push(res.data);
//   // }
//   // return mediaIds;
// }

export const postTweet = schemaTask({
  id: "post-tweet",
  schema: payloadSchema,
  run: async (payload) => {
    try {
      const { appUserId, tweet } = payload;

      const url = `https://labs.pathfix.com/oauth/method/twitteroauth2/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      const body = {
        url: "https://api.twitter.com/2/tweets",
        method: "POST",
        payload: {
          text: tweet,
        },
        headers: {
          "Content-Type": "application/json",
        },
      };

      console.log(url, body, { params });

      // Make a GET request to the Pathfix API
      const res = await axios.post(url, body, { params });

      // Return the response data from Pathfix
      return res.data;
    } catch (error: any) {
      console.log(error);
    }
  },
});

export const postTweetWithMedia = schemaTask({
  id: "post-tweet-media",
  schema: payloadSchema,
  run: async (payload) => {
    try {
      const { appUserId, tweet, media } = payload;

      const url = `https://labs.pathfix.com/oauth/method/twitteroauth2/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      let body = {
        url: "https://upload.twitter.com/1.1/media/upload.json?command=INIT&media_type=video/mp4&total_bytes=4430752",
        method: "POST",
      };

      // // Make a GET request to the Pathfix API
      const res = await axios.post(url, body, { params });

      // Return the response data from Pathfix
      return res.data;
    } catch (error: any) {
      console.log(error);
    }
  },
});

export const postThread = schemaTask({
  id: "post-thread",
  schema: threadPayloadSchema,
  run: async (payload) => {
    try {
      const { appUserId, tweets } = payload;

      const url = `https://labs.pathfix.com/oauth/method/twitteroauth2/call`;

      // Prepare the request parameters
      const params = {
        user_id: appUserId,
        public_key: "5CBC16AE-FC0D-4694-9914-76C21BADCB6D",
        private_key: "4D5D34B4-176F-47FB-9D2B-EE1407499A02",
      };

      const body = {
        url: "https://api.twitter.com/2/tweets",
        method: "POST",
        payload: {
          text: tweets[0],
        },
        headers: {
          "Content-Type": "application/json",
        },
      };

      console.log(url, body, { params });

      // Make a GET request to the Pathfix API
      const res = await axios.post(url, body, { params });

      console.log(res.data.rows[0].internalError, "data of tweet");

      let previousTweetId = res.data.rows[0];

      if (!previousTweetId) {
        throw new Error(previousTweetId);
      }

      const tweetsArray = tweets.slice(1);

      for (const tweet of tweetsArray) {
        let body: any = {
          url: "https://api.twitter.com/2/tweets",
          method: "POST",
          payload: {
            text: tweet,
            reply: {
              in_reply_to_tweet_id: previousTweetId,
            },
          },
          headers: {
            "Content-Type": "application/json",
          },
        };

        // Send the tweet via Pathfix
        const response = await axios.post(url, body, { params });

        previousTweetId = response.data?.rows?.[0]?.data?.data?.id;

        if (!previousTweetId) {
          throw new Error("Failed to retrieve tweet ID in the thread.");
        }
      }

      console.log("Thread posted successfully!");
      return previousTweetId;
    } catch (error: any) {
      console.error(
        "Error posting thread:",
        error.response?.data || error.message,
      );
    }
  },
});
