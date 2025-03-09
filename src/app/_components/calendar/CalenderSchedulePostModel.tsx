"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { Button } from "~/components/ui/button";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";
import { useAtom } from "jotai";
import {
  CALENDARFLOW,
  Media,
  calendarFlowAtom,
  postDescriptionAtom,
  postMediaAtom,
  postTextAtom,
  postTitleAtom,
  scheduleAndTimeAtom,
  selectedAccountAtom,
  selectedOptionAtom,
  socialAccountsAtom,
} from "~/atoms/calendarAtoms";
import PostScheduleForm from "./PostScheduleForm";
import SelectAccountModel from "./SelectAcccountModel";
import SelectOptionsModel from "./SelectOptionsModel";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  postFacebookImagePostTrigger,
  postFacebookMultipleImagePostTrigger,
  postFacebookStoryPostTrigger,
  postFacebookTextPostTrigger,
  postFacebookVideoPostTrigger,
  postInstagramCarouselPostTrigger,
  postInstagramImageTrigger,
  postInstagramReelTrigger,
  postInstagramStoryTrigger,
  postLinkedInCarouselPostTrigger,
  postLinkedInImagePostTrigger,
  postLinkedInTextPostTrigger,
  postLinkedInVideoPostTrigger,
  postThreadOnTwitterTrigger,
  postTweetOnTwitterTrigger,
  postTweetWithMediaOnTwitterTrigger,
  postYoutubeVideoTrigger,
} from "~/app/api/trigger/actions";
import { configure, runs } from "@trigger.dev/sdk/v3";
import { trpc } from "~/trpc/react";
import { CalendarEvent } from "./calender-components/types";
import { toast } from "sonner";

const CalendarSchedulePostModel = ({
  trigger,
  post,
}: {
  trigger?: React.ReactNode;
  post?: CalendarEvent;
}) => {
  const { user } = useUser();
  const [flow, setFlow] = useAtom(calendarFlowAtom);
  const [socialAccounts] = useAtom(socialAccountsAtom);
  const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
  const [postMedia, setPostMedia] = useAtom(postMediaAtom);
  const [postText, setPostText] = useAtom(postTextAtom);
  const [postTitle, setPostTitle] = useAtom(postTitleAtom);
  const [postDescription, setPostDescription] = useAtom(postDescriptionAtom);
  const [selectedOption, setSelectedOption] = useAtom(selectedOptionAtom);
  const [selectedDate, setSelectedDate] = useAtom(scheduleAndTimeAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false); // Manage dialog state
  const trpcUtils = trpc.useContext();
  const { organization: defaultSpace } = useOrganization();
  const [isPosting, setIsPosting] = useState<boolean>(false);

  useEffect(() => {
    if (!!post && isDialogOpen) {
      setPostMedia(post.media as Media[]);
      setPostText(post.content as string);
      setPostTitle(post.title as string);
      setSelectedDate(post.scheduledAt as Date);
      setSelectedAccount(post.platform as string);
      setSelectedOption(post.postType as string);
    }
  }, []);

  const handleNext = () => {
    if (flow === CALENDARFLOW.CREATE && selectedAccount) {
      const account = socialAccounts.find(
        (acc) => acc.value === selectedAccount,
      );

      if (account && account.options && account.options.length > 0) {
        setFlow(CALENDARFLOW.OPTIONS);
      } else {
        setSelectedOption(null);
        setFlow(CALENDARFLOW.FORM);
      }
    } else if (flow === CALENDARFLOW.OPTIONS && selectedOption) {
      setFlow(CALENDARFLOW.FORM);
    }
  };

  const handleBack = () => {
    if (flow === CALENDARFLOW.FORM) {
      const account = socialAccounts.find(
        (acc) => acc.name === selectedAccount,
      );
      if (account && account.options && account.options.length > 0) {
        setFlow(CALENDARFLOW.OPTIONS);
      } else {
        setFlow(CALENDARFLOW.CREATE);
      }
    } else if (flow === CALENDARFLOW.OPTIONS) {
      setFlow(CALENDARFLOW.CREATE);
    }
  };

  const createPostMutation = trpc.pathfix.createPost.useMutation({
    onSuccess: () => {
      console.log("Post created successfully");
      setLoading(false);
      setDialogOpen(false);
      setFlow(CALENDARFLOW.CREATE);
      setPostMedia([]);
      setPostText("");
      setPostTitle("");
      setSelectedDate(new Date());
      trpcUtils.pathfix.getUserPosts.invalidate({
        userId: user?.id as string,
      });
    },
    onError: (error) => {
      console.error("Failed to create post: ", error);
      setLoading(false);
    },
  });

  const updatePostMutation = trpc.pathfix.updatePost.useMutation({
    onSuccess: () => {
      console.log("Post created successfully");
      setLoading(false);
      setDialogOpen(false);
      setFlow(CALENDARFLOW.CREATE);

      setPostMedia([]);
      setPostText("");
      setPostTitle("");
      setSelectedDate(new Date());
      trpcUtils.pathfix.getUserPosts.invalidate({
        userId: user?.id as string,
      });
    },
    onError: (error) => {
      console.error("Failed to create post: ", error);
      setLoading(false);
    },
  });

  const handleUpload = async (status: string) => {
    configure({
      secretKey: process.env.NEXT_PUBLIC_TRIGGER_SECRET_KEY,
    });

    setIsPosting(true);

    // video and shorts
    if (selectedAccount === "youtube") {
      //validation checks for media type and only a single video can be uploaded at a time.

      const responseId = await postYoutubeVideoTrigger(
        user?.emailAddresses[0]?.emailAddress as string,
        "5s", // timestamp for scheduling
        postText,
        postDescription,
        "https://static.videezy.com/system/resources/previews/000/049/922/original/Passengers_and_Ship_TL.mp4", //replace with your video url
        selectedOption as string,
      );

      if (responseId) {
        const result = await runs.retrieve(responseId);

        if (result.isSuccess) {
          console.log(result.output);
        }
      }
    }

    // story, post, reel
    // photo and video
    if (selectedAccount === "instagram") {
      if (selectedOption === "Post") {
        if (postMedia.length === 1) {
          //check if it is an image. for video post a reel.
          const responseId = await postInstagramImageTrigger(
            user?.emailAddresses[0]?.emailAddress as string,
            "5s",
            postText,
            postMedia[0]?.content as string,
          );
        } else if (postMedia.length > 1) {
          // can be image or video
          const responseId = await postInstagramCarouselPostTrigger(
            user?.emailAddresses[0]?.emailAddress as string,
            "5s",
            postText,
            postMedia.map((media) => media.content as string),
          );
        } else if (postMedia.length === 0) {
          toast.error("Please upload a media");
          setIsPosting(false);
          return;
        }
      } else if (selectedOption === "Reel") {
        if (postMedia.length === 0) {
          toast.error("Please upload a media");
          setIsPosting(false);
          return;
        }
        // check if the media is a video else throw an error
        const responseId = await postInstagramReelTrigger(
          user?.emailAddresses[0]?.emailAddress as string,
          "5s",
          postText,
          // "https://static.videezy.com/system/resources/previews/000/049/922/original/Passengers_and_Ship_TL.mp4",
          postMedia[0]?.content as string,
        );
      } else if (selectedOption === "Story") {
        const responseId = await postInstagramStoryTrigger(
          user?.emailAddresses[0]?.emailAddress as string,
          "5s",
          postText,
          postMedia[0]?.content as string,
        );
      }
    }

    // text post, image post, video post.
    // story with photo or video
    if (selectedAccount === "facebook") {
      let mediaUrl =
        "https://static.videezy.com/system/resources/previews/000/049/922/original/Passengers_and_Ship_TL.mp4";

      let res = await fetch(mediaUrl);

      const mtype = res.headers.get("content-type");

      // const responseId = await postFacebookImagePostTrigger(
      //   user?.emailAddresses[0]?.emailAddress as string,
      //   postText,
      //   selectedDate.toISOString(),
      //   "https://images.unsplash.com/photo-1740231614760-8037a7896030?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
      //   // postMedia[0]?.content as string,
      // );

      if (selectedOption === "Post" && postMedia.length > 1) {
        if (mtype?.includes("image")) {
          const responseId = await postFacebookMultipleImagePostTrigger(
            user?.emailAddresses[0]?.emailAddress as string,
            postText,
            selectedDate.toISOString(),
            postMedia.map((media) => media.content as string),
          );
        }
        // }
      } else if (postMedia.length === 0 && selectedOption === "Post") {
        if (mtype?.includes("image")) {
          const responseId = await postFacebookImagePostTrigger(
            user?.emailAddresses[0]?.emailAddress as string,
            postText,
            selectedDate.toISOString(),
            // "https://images.unsplash.com/photo-1740231614760-8037a7896030?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            postMedia[0]?.content as string,
          );
        } else if (mtype?.includes("video")) {
          const responseId = await postFacebookVideoPostTrigger(
            user?.emailAddresses[0]?.emailAddress as string,
            postText,
            selectedDate.toISOString(),
            postMedia[0]?.content as string,
          );
        } else if (postMedia.length === 0 && selectedOption === "Post") {
          const responseId = await postFacebookTextPostTrigger(
            user?.emailAddresses[0]?.emailAddress as string,
            postText,
            selectedDate.toISOString(),
          );
        }
      }

      if (selectedOption === "Story") {
        const responseId = await postFacebookStoryPostTrigger(
          user?.emailAddresses[0]?.emailAddress as string,
          postText,
          selectedDate.toISOString(),
          // "https://images.unsplash.com/photo-1740231614760-8037a7896030?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
          // postMedia[0]?.content as string,
          "https://static.videezy.com/system/resources/previews/000/049/922/original/Passengers_and_Ship_TL.mp4",
        );
      }
    }

    // text post, image post, video post.
    if (selectedAccount === "linkedin") {
      // if (selectedOption === "Post" && postMedia.length === 0) {
      //   const responseId = await postLinkedInTextPostTrigger(
      //     "kevin@m0.ventures",
      //     postText,
      //     selectedDate.toISOString(),
      //   );
      // } else
      if (selectedOption === "Post" && postMedia.length === 0) {
        let mediaUrl =
          "https://static.videezy.com/system/resources/previews/000/049/922/original/Passengers_and_Ship_TL.mp4";

        let res = await fetch(mediaUrl);

        const mtype = res.headers.get("content-type");

        if (mtype?.includes("video")) {
          const responseId = await postLinkedInVideoPostTrigger(
            user?.emailAddresses[0]?.emailAddress as string,
            postText,
            selectedDate.toISOString(),
            "https://static.videezy.com/system/resources/previews/000/049/922/original/Passengers_and_Ship_TL.mp4",
          );
        } else if (mtype?.includes("image")) {
          const responseId = await postLinkedInImagePostTrigger(
            user?.emailAddresses[0]?.emailAddress as string,
            postText,
            selectedDate.toISOString(),
            "https://images.unsplash.com/photo-1740231614760-8037a7896030?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            // postMedia[0]?.content as string,
          );
        }
      } else if (selectedOption === "Post" && postMedia.length > 1) {
        const medias = postMedia.map((media) => media.content as string);
        const responseId = await postLinkedInCarouselPostTrigger(
          user?.emailAddresses[0]?.emailAddress as string,
          postText,
          selectedDate.toISOString(),
          medias,
        );
      }
    }

    //tweet, tweet with media, thread
    if (selectedAccount === "twitter") {
      if (selectedOption === "Tweet") {
        if (postMedia.length === 0) {
          const responseId = await postTweetOnTwitterTrigger(
            user?.emailAddresses[0]?.emailAddress as string,
            postText,
            selectedDate.toISOString(),
          );
        } else if (postMedia.length > 0) {
          const medias: string[] = postMedia.map((media) =>
            typeof media.content === "string"
              ? media.content
              : media.content.name,
          );
          const responseId = await postTweetWithMediaOnTwitterTrigger(
            user?.emailAddresses[0]?.emailAddress as string,
            postText,
            selectedDate.toISOString(),
            medias,
          );
        }
      } else if (selectedOption === "Thread") {
        // provide text boxes for each tweet
        const responseId = await postThreadOnTwitterTrigger(
          user?.emailAddresses[0]?.emailAddress as string,
          ["pathfix", "hellasdo", "this asdasdis a thread"],
          selectedDate.toISOString(),
        );
      }
    }

    // subscribing to run. check if it is completed.
    // for await (const run of runs.subscribeToRun(responseId)) {
    //   if (run.status === "COMPLETED") {

    //   }
    // }

    // if completed, check if the result is success.
    // then create the post in the database.

    // if (result.isSuccess) {
    //   console.log(result.output);
    // }

    // if (result.isSuccess) {
    //   // setLoading(true);
    //   // const body = {
    //   //   title: postTitle,
    //   //   userId: user?.id as string,
    //   //   platform: selectedAccount?.toLowerCase() as
    //   //     | "youtube"
    //   //     | "twitter"
    //   //     | "instagram"
    //   //     | "facebook"
    //   //     | "linkedin",
    //   //   content: postText,
    //   //   postType: selectedOption as string,
    //   //   media: postMedia,
    //   //   scheduledAt: selectedDate,
    //   //   status: status as "draft" | "scheduled" | "posted" | "failed",
    //   //   workspaceId: defaultSpace?.id as string,
    //   // };
    //   // await createPostMutation.mutateAsync(body);
    // }

    setIsPosting(false);
  };

  const handleUpdate = async (status: string) => {
    setLoading(true);
    const body = {
      id: post?.id as string,
      title: postTitle,
      userId: user?.id as string,
      platform: selectedAccount?.toLowerCase() as
        | "youtube"
        | "twitter"
        | "instagram"
        | "facebook"
        | "linkedin",
      content: postText,
      postType: selectedOption as string,
      media: postMedia,
      scheduledAt: selectedDate,
      status: status as "draft" | "scheduled" | "posted" | "failed",
      workspaceId: defaultSpace?.id as string,
    };
    // await updatePostMutation.mutateAsync(body);
  };

  const handleModal = () => {
    setDialogOpen(!isDialogOpen);
    setFlow(CALENDARFLOW.CREATE);
    setSelectedAccount(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleModal}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="default" size="sm">
            Schedule Post
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex min-h-[400px] w-full max-w-4xl flex-col gap-5">
        <DialogTitle className="text-center">
          {flow === CALENDARFLOW.CREATE && "Choose Social Account"}
          {flow === CALENDARFLOW.OPTIONS && "Select Post Type"}
          {flow === CALENDARFLOW.FORM && "Create Post"}
        </DialogTitle>

        <XWGradSeparator />

        <div className="flex flex-1 flex-col">
          {flow === CALENDARFLOW.CREATE && <SelectAccountModel />}
          {flow === CALENDARFLOW.OPTIONS && <SelectOptionsModel />}
          {flow === CALENDARFLOW.FORM && <PostScheduleForm />}
        </div>

        <XWGradSeparator />

        <div className="mb-0 mt-auto flex justify-between">
          {flow !== CALENDARFLOW.CREATE && (
            <XWSecondaryButton onClick={handleBack}>Back</XWSecondaryButton>
          )}
          {flow !== CALENDARFLOW.FORM && (
            <Button variant="default" onClick={handleNext} className="ml-auto">
              Next
            </Button>
          )}

          {flow === CALENDARFLOW.FORM && (
            <div className="flex items-center gap-2">
              {!!post ? (
                <Button
                  variant="default"
                  disabled={loading}
                  onClick={() => {
                    handleUpdate("scheduled");
                  }}
                  className="ml-auto"
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="default"
                  disabled={loading}
                  onClick={() => {
                    handleUpload("scheduled");
                  }}
                  className="ml-auto"
                >
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarSchedulePostModel;
