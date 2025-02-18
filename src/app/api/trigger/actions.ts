"use server";

import {
  postInstagramCarousel,
  postInstagramImagePost,
  postInstagramReel,
  postInstagramStory,
} from "~/trigger/instagram";
import { postThread, postTweet, postTweetWithMedia } from "~/trigger/twitter";
import {
  postFacebookImagePost,
  postFacebookImageStory,
  postFacebookMultipleImagePost,
  postFacebookTextPost,
  // postFacebookVideoStory,
} from "~/trigger/facebook";
import {
  postLinkedInCarouselPost,
  postLinkedInImagePost,
  postLinkedInTextPost,
  postLinkedInVideoPost,
} from "~/trigger/linkedin";
import { postYoutubeShorts, postYoutubeVideo } from "~/trigger/youtube";

// INSTAGRAM

export async function postInstagramImageTrigger(
  userId: string,
  time: string,
  text: string,
  media: string,
) {
  const handle = await postInstagramImagePost.trigger(
    { appUserId: userId, text: text, media: [media] },
    { delay: time },
  );

  return handle.id;
}

export async function postInstagramCarouselPostTrigger(
  userId: string,
  time: string,
  text: string,
  media: string[],
) {
  const handle = await postInstagramCarousel.trigger(
    { appUserId: userId, text: text, media: media },
    { delay: time },
  );

  return handle.id;
}

export async function postInstagramReelTrigger(
  userId: string,
  time: string,
  text: string,
  video: string,
) {
  const handle = await postInstagramReel.trigger(
    { appUserId: userId, text: text, media: [video] },
    { delay: time },
  );

  return handle.id;
}

export async function postInstagramStoryTrigger(
  userId: string,
  time: string,
  text: string,
  video: string,
) {
  const handle = await postInstagramStory.trigger(
    { appUserId: userId, text: text, media: [video] },
    { delay: time },
  );

  return handle.id;
}

// FACEBOOK

export async function postFacebookTextPostTrigger(
  userId: string,
  text: string,
  time: string,
) {
  console.log("posting fb text post");
  const handle = await postFacebookTextPost.trigger(
    { appUserId: userId, text: text },
    { delay: time },
  );

  return handle.id;
}

export async function postFacebookImagePostTrigger(
  userId: string,
  text: string,
  time: string,
  photo: string,
) {
  const handle = await postFacebookImagePost.trigger(
    { appUserId: userId, text: text, photo: photo },
    { delay: time },
  );

  return handle.id;
}

export async function postFacebookMultipleImagePostTrigger(
  userId: string,
  text: string,
  time: string,
  photo: string[],
) {
  const handle = await postFacebookMultipleImagePost.trigger(
    { appUserId: userId, text: text, photos: photo },
    { delay: time },
  );

  return handle.id;
}

export async function postFacebookStoryPostTrigger(
  userId: string,
  text: string,
  time: string,
  media: string,
) {
  if (true) {
    const handle = await postFacebookImageStory.trigger(
      { appUserId: userId, text: text, photo: media },
      { delay: time },
    );
    return handle.id;
  } else {
    // const handle = await postFacebookVideoStory.trigger(
    //   { appUserId: userId, text: text, photo: media },
    //   { delay: time },
    // );
    // return handle.id;
  }
}

// LINKEDIN

export async function postLinkedInTextPostTrigger(
  userId: string,
  text: string,
  time: string,
) {
  const handle = await postLinkedInTextPost.trigger(
    { appUserId: userId, text: text },
    { delay: time },
  );

  return handle.id;
}

export async function postLinkedInImagePostTrigger(
  userId: string,
  text: string,
  time: string,
  media: string,
) {
  const handle = await postLinkedInImagePost.trigger(
    { appUserId: userId, text: text, photo: media },
    { delay: time },
  );

  return handle.id;
}

export async function postLinkedInVideoPostTrigger(
  userId: string,
  text: string,
  time: string,
  media: string,
) {
  const handle = await postLinkedInVideoPost.trigger(
    { appUserId: userId, text: text, photo: media },
    { delay: time },
  );

  return handle.id;
}

export async function postLinkedInCarouselPostTrigger(
  userId: string,
  text: string,
  time: string,
  media: string[],
) {
  const handle = await postLinkedInCarouselPost.trigger(
    { appUserId: userId, text: text, photos: media },
    { delay: time },
  );

  return handle.id;
}

// TWITTER

export async function postTweetWithMediaOnTwitterTrigger(
  userId: string,
  tweet: string,
  time: string,
  media: string[],
) {
  const handle = await postTweetWithMedia.trigger(
    { appUserId: userId, tweet: tweet, media: media },
    { delay: time },
  );

  return handle.id;
}

export async function postThreadOnTwitterTrigger(
  userId: string,
  tweets: string[],
  time: string,
) {
  const handle = await postThread.trigger(
    { appUserId: userId, tweets: tweets },
    { delay: time },
  );

  return handle.id;
}

export async function postTweetOnTwitterTrigger(
  userId: string,
  tweet: string,
  time: string,
) {
  const handle = await postTweet.trigger(
    { appUserId: userId, tweet: tweet },
    { delay: time },
  );

  return handle.id;
}

// YOUTUBE

export async function postYoutubeVideoTrigger(
  userId: string,
  time: string,
  title: string,
  description: string,
  videoUrl: string,
  selectedOption: string,
) {
  if (selectedOption === "Video") {
    const handle = await postYoutubeVideo.trigger(
      {
        appUserId: userId,
        title: title,
        description: description,
        videoUrl: videoUrl,
      },
      { delay: time },
    );
    return handle.id;
  } else if (selectedOption === "Shorts") {
    const handle = await postYoutubeShorts.trigger(
      {
        appUserId: userId,
        title: title,
        description: description,
        videoUrl: videoUrl,
      },
      { delay: time },
    );
    return handle.id;
  }
}
