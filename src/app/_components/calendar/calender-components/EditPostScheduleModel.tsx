"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Image from "next/image";
import { Check, FileIcon, Loader } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from "~/components/ui/tooltip";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";
import { CalendarEvent } from "./types";
import { useUser } from "@clerk/nextjs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Media } from "~/atoms/calendarAtoms";
import { format } from "date-fns";
import { trpc } from "~/trpc/react";
import TwitterIcon from "~/icons/SocialIcons/TwitterIcon";
import InstagramIcon from "~/icons/SocialIcons/InstagramIcon";
import YouTubeIcon from "~/icons/SocialIcons/YoutubeIcon";
import FacebookIcon from "~/icons/SocialIcons/FaceBookIcon";
import LinkedInIcon from "~/icons/SocialIcons/LinkedinIcon";
import CalendarSchedulePostModel from "../CalenderSchedulePostModel";

interface EditPostScheduleModelProps {
  trigger?: React.ReactNode;
  post?: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

const EditPostScheduleModel = ({
  trigger,
  post,
  isOpen,
  onClose,
}: EditPostScheduleModelProps) => {
  const { user } = useUser();
  const trpcUtils = trpc.useContext();
  const [loading, setLoading] = useState<boolean>(false);

  const deletePostMutation = trpc.pathfix.deletePost.useMutation({
    onSuccess: () => {
      console.log("Post created successfully");
      trpcUtils.pathfix.getUserPosts.invalidate({
        userId: user?.id as string,
      });
      onClose();
      setLoading(false);
    },
  });

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deletePostMutation.mutateAsync({ postId: post?.id as string });
    } catch (error) {
      setLoading(false);
    }
  };

  const formatScheduledDate = (dateString?: Date) => {
    if (!dateString) return "No date available";
    return format(new Date(dateString), "d MMMM 'at' h:mmaaa").toLowerCase();
  };

  const imageContainerClass = "relative w-full group";
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>
                {trigger ? trigger : <Button variant="primary" size={"sm"}>Edit Post</Button>}
            </DialogTrigger> */}
      <DialogContent className="flex w-full max-w-4xl flex-col gap-5">
        <DialogTitle className="text-center">Post Details</DialogTitle>
        <XWGradSeparator />
        <div className="gap-2">
          <div className="grid grid-cols-2 gap-4 p-2">
            <div className="gap-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="relative h-8 w-8">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white p-[2px]">
                      {post?.platform === "twitter" ? (
                        <TwitterIcon className="h-6 w-6" />
                      ) : post?.platform === "instagram" ? (
                        <InstagramIcon className="h-6 w-6" />
                      ) : post?.platform === "youtube" ? (
                        <YouTubeIcon className="h-6 w-6" />
                      ) : post?.platform === "facebook" ? (
                        <FacebookIcon className="h-6 w-6" />
                      ) : (
                        <LinkedInIcon className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex w-full items-center justify-between">
                    <p>{user?.fullName}</p>
                    <span className="ml-auto mr-0">
                      <Check className="h-4 w-4 text-xw-muted" />
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">
                      {formatScheduledDate(post?.scheduledAt as Date)}
                      {/* {format(new Date(post?.scheduledAt as Date), "d MMMM 'at' h:mmaaa").toLowerCase()} */}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 w-full rounded-lg">
                <Carousel className="">
                  <CarouselContent>
                    {Array.isArray(post?.media) && post?.media.length > 0 ? (
                      post?.media.map((media: Media, i: number) => (
                        <CarouselItem key={i}>
                          <div className={imageContainerClass}>
                            {/* <img
                                                            src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_BASE_URL}${item.content}`}
                                                            alt={`Media ${i + 1}`}
                                                            className={imageClass}
                                                        /> */}
                            {/* <div className="relative h-32 w-32 rounded-md flex justify-center items-center"> */}
                            {media.source === "url" &&
                              media.type === "image" && (
                                <img
                                  src={media.content as string}
                                  alt="media"
                                  className="h-full w-full object-cover"
                                />
                              )}
                            {media.source === "url" &&
                              media.type === "video" && (
                                <video
                                  src={media.content as string}
                                  controls
                                  className="h-full w-full"
                                />
                              )}
                            {media.source === "url" &&
                              media.type === "audio" && (
                                <audio
                                  src={media.content as string}
                                  controls
                                  className="w-full"
                                />
                              )}
                            {media.source === "url" && media.type === "doc" && (
                              <div className="flex flex-row items-center gap-2">
                                <div>
                                  <FileIcon className="h-10 w-10 text-gray-600" />
                                </div>
                                <div className="flex flex-col items-start justify-start">
                                  <div>
                                    <h2 className="mt-2 text-center text-sm font-medium">
                                      {media.content as string}
                                    </h2>
                                  </div>
                                </div>
                              </div>
                            )}
                            {media.source === "file" &&
                              media.type === "image" && (
                                <img
                                  src={URL.createObjectURL(
                                    media.content as File,
                                  )}
                                  alt="media"
                                  className="h-full w-full object-cover"
                                />
                              )}
                            {media.source === "file" &&
                              media.type === "video" && (
                                <video
                                  src={URL.createObjectURL(
                                    media.content as File,
                                  )}
                                  controls
                                  className="h-full w-full"
                                />
                              )}
                            {media.source === "file" &&
                              media.type === "audio" && (
                                <audio
                                  src={URL.createObjectURL(
                                    media.content as File,
                                  )}
                                  controls
                                  className="w-full"
                                />
                              )}
                            {media.source === "key" &&
                              media.type === "image" && (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_BASE_URL}${media.content as string}`}
                                  alt="media"
                                  className="h-full w-full object-cover"
                                />
                              )}
                            {media.source === "key" && media.type === "doc" && (
                              <div className="flex w-full flex-row items-center gap-2 overflow-hidden rounded-md border border-gray-300 p-2">
                                <div>
                                  <FileIcon className="h-9 w-9 text-gray-600" />
                                </div>
                                <div className="flex flex-col items-start justify-start">
                                  <div>
                                    <h2 className="mt-2 text-center text-sm font-medium">
                                      {media.content as string}
                                    </h2>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* </div> */}
                          </div>
                        </CarouselItem>
                      ))
                    ) : (
                      <p className="ps-5 text-center text-sm">
                        No media available
                      </p>
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            </div>

            <div className="flex h-full flex-1 flex-col gap-2">
              <label>Enter Post Text</label>
              <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg border border-xw-secondary bg-xw-background focus:border-xw-primary">
                <textarea
                  onChange={() => {}}
                  value={post?.content}
                  placeholder="Enter Post Text"
                  className="h-full flex-1 resize-none border-none bg-transparent p-2 focus:outline-none focus:ring-0"
                />
                <div className="flex items-center gap-2 p-2">
                  <Button className="h-8 w-8" size="icon" variant="ghost">
                    <Image
                      src="/icons/add-emoji.svg"
                      alt="add-emoji"
                      width={16}
                      height={16}
                    />
                  </Button>
                  <Button className="h-8 w-8" size="icon" variant="ghost">
                    <Image
                      src="/icons/hashtag.svg"
                      alt="hash"
                      width={16}
                      height={16}
                    />
                  </Button>
                  <Button className="h-8 w-8" size="icon" variant="ghost">
                    <Image
                      src="/icons/at-sign.svg"
                      alt="at-sign"
                      width={16}
                      height={16}
                    />
                  </Button>
                  <div className="ml-auto mr-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" className="h-9 w-9 rounded-full">
                            <Image
                              src="/icons/ideabulb.svg"
                              alt="idea bulb"
                              width={20}
                              height={20}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="mx-2 max-w-xs bg-white p-2 text-sm text-xw-secondary">
                          <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button onClick={handleDelete} variant="destructive" size="sm">
              {loading ? (
                <Loader className="h-6 w-6 animate-spin text-white" />
              ) : (
                "Delete"
              )}
            </Button>
            <CalendarSchedulePostModel
              post={post}
              trigger={
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-whiten h-8 rounded-md bg-blue-600 shadow-lg hover:bg-blue-500"
                >
                  Update
                </Button>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostScheduleModel;
