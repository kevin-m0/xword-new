"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Clock, FileIcon } from "lucide-react";
import TwitterIcon from "~/icons/SocialIcons/TwitterIcon";
import InstagramIcon from "~/icons/SocialIcons/InstagramIcon";
import YouTubeIcon from "~/icons/SocialIcons/YoutubeIcon";
import FacebookIcon from "~/icons/SocialIcons/FaceBookIcon";
import LinkedInIcon from "~/icons/SocialIcons/LinkedinIcon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import moment from "moment";
import { Media } from "~/atoms/calendarAtoms";
import CalendarSchedulePostModel from "../CalenderSchedulePostModel";

interface EventDialogProps {
  event: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDialog = ({ event, isOpen, onClose }: EventDialogProps) => {
  if (!event) return null;

  const imageContainerClass = "relative w-full h-[300px] group";
  const imageClass =
    "object-contain w-full h-full duration-300 group-hover:scale-105";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-lg bg-xw-sidebar">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {event.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-6 w-6" />
            <span>
              {moment(event.start).format("MMM D, YYYY h:mm A")} -{" "}
              {moment(event.end).format("h:mm A")}
            </span>
          </div>
          {/* <h1 className="text-lg font-medium">{event.title}</h1> */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <h2 className="font-semibold">Platform:</h2>
              <div className="ms-2">
                {event.platform === "twitter" ? (
                  <TwitterIcon className="h-6 w-6" />
                ) : event.platform === "instagram" ? (
                  <InstagramIcon className="h-6 w-6" />
                ) : event.platform === "youtube" ? (
                  <YouTubeIcon className="h-6 w-6" />
                ) : event.platform === "facebook" ? (
                  <FacebookIcon className="h-6 w-6" />
                ) : (
                  <LinkedInIcon className="h-6 w-6" />
                )}
              </div>
            </div>
            <div className="flex items-center">
              <h2 className="font-semibold">PostType:</h2>
              <div className="ms-2">{event.postType || ""}</div>
            </div>
          </div>
          <div>
            <h2>Post Text:</h2>
            <p>{event.content || "No content provided."}</p>
          </div>
          <div className="mx-auto w-full">
            <Carousel className="">
              <CarouselContent>
                {Array.isArray(event.media) && event.media.length > 0 ? (
                  event.media.map((media: Media, i: number) => (
                    <CarouselItem key={i}>
                      <div className={imageContainerClass}>
                        {/* <img
                                                    src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_BASE_URL}${item.content}`}
                                                    alt={`Media ${i + 1}`}
                                                    className={imageClass}
                                                /> */}
                        {/* <div className="relative h-32 w-32 rounded-md flex justify-center items-center"> */}
                        {media.source === "url" && media.type === "image" && (
                          <img
                            src={media.content as string}
                            alt="media"
                            className="h-full w-full object-cover"
                          />
                        )}
                        {media.source === "url" && media.type === "video" && (
                          <video
                            src={media.content as string}
                            controls
                            className="h-full w-full"
                          />
                        )}
                        {media.source === "url" && media.type === "audio" && (
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
                        {media.source === "file" && media.type === "image" && (
                          <img
                            src={URL.createObjectURL(media.content as File)}
                            alt="media"
                            className="h-full w-full object-cover"
                          />
                        )}
                        {media.source === "file" && media.type === "video" && (
                          <video
                            src={URL.createObjectURL(media.content as File)}
                            controls
                            className="h-full w-full"
                          />
                        )}
                        {media.source === "file" && media.type === "audio" && (
                          <audio
                            src={URL.createObjectURL(media.content as File)}
                            controls
                            className="w-full"
                          />
                        )}
                        {media.source === "key" && media.type === "image" && (
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
                  <p className="ps-5 text-center text-sm">No media available</p>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          {event.description && (
            <p className="text-sm text-xw-muted">{event.description}</p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>

            <CalendarSchedulePostModel
              post={event}
              trigger={
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-whiten h-8 rounded-md bg-blue-600 shadow-lg hover:bg-blue-500"
                >
                  Update Post
                </Button>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
