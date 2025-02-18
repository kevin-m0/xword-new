"use client";

import React from "react";
import * as z from "zod";

import { FileIcon, PlusIcon } from "lucide-react";
import XWDateTimePicker from "~/components/reusable/XWDateTimePicker";

import { useAtom } from "jotai";
import {
  socialAccountsAtom,
  selectedAccountAtom,
  selectedOptionAtom,
  postMediaAtom,
  scheduleAndTimeAtom,
  postTitleAtom,
  postTextAtom,
  postDescriptionAtom,
} from "~/atoms/calendarAtoms";
import { useUser } from "@clerk/nextjs";
import UploadContentModel from "./UploadContentModel";
import SelectImages from "./SelectImages";
import SelectDocument from "./SelectDocument";

const formSchema = z.object({
  postText: z
    .string()
    .min(1, "Post text is required")
    .max(280, "Post text must be 280 characters or less"),
  visibility: z.enum(["public", "private", "unlisted"]),
  scheduledTime: z
    .date()
    .min(new Date(), "Scheduled time must be in the future"),
});

const docArray = ["Shorts", "Reel", "Video"];

const PostScheduleForm = () => {
  const { user } = useUser();
  const [socialAccounts] = useAtom(socialAccountsAtom);
  const [selectedAccount] = useAtom(selectedAccountAtom);
  const [selectedOption] = useAtom(selectedOptionAtom);
  const [selectedDate, setSelectedDate] = useAtom(scheduleAndTimeAtom);
  const [postMedia, setPostMedia] = useAtom(postMediaAtom);
  const [postText, setPostText] = useAtom(postTextAtom);
  const [postTitle, setPostTitle] = useAtom(postTitleAtom);
  const [postDescription, setPostDescription] = useAtom(postDescriptionAtom);

  console.log("selectedOption-p--->", selectedOption);

  const handleRemoveMedia = (index: number) => {
    setPostMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const account = socialAccounts.find((acc) => acc.name === selectedAccount);
  const option = account?.options?.find((opt) => opt.id === selectedOption);

  return (
    <form className="grid max-h-[70vh] max-w-[90vw] grid-cols-5 overflow-y-scroll rounded-md bg-xw-background">
      {/* Section Two */}
      <div className="col-span-5 flex flex-col gap-10 p-5">
        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-white">
            Title<span className="text-red-600">*</span>
          </label>
          <input
            value={postTitle}
            onChange={(e) => {
              setPostTitle(e.target.value);
            }}
            type="text"
            id="title"
            name="title"
            placeholder="Enter title"
            className="w-full rounded-md border border-gray-700 bg-transparent px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-white">
            Schedule Post<span className="text-red-600">*</span>
          </label>
          <XWDateTimePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
          />
        </div>
        {!(selectedOption === "Story") && (
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Enter Post Text
            </label>
            <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-xw-secondary bg-xw-background focus-within:border-xw-primary">
              <textarea
                value={postText}
                onChange={(e) => {
                  setPostText(e.target.value);
                }}
                placeholder="Enter Post Text"
                className="h-full flex-1 resize-none border-none bg-transparent p-2 focus:border-none focus:outline-none focus:ring-0"
              ></textarea>
              <div className="flex items-center gap-2 p-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-xw-primary">
                  <img
                    src="/icons/add-emoji.svg"
                    alt="add-emoji"
                    className="h-4 w-4"
                  />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-xw-primary">
                  <img
                    src="/icons/hashtag.svg"
                    alt="hash"
                    className="h-4 w-4"
                  />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-xw-primary">
                  <img
                    src="/icons/at-sign.svg"
                    alt="at-sign"
                    className="h-4 w-4"
                  />
                </button>
                <div className="ml-auto">
                  <div className="group relative">
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-xw-primary">
                      <img
                        src="/icons/ideabulb.svg"
                        alt="idea bulb"
                        className="h-5 w-5"
                      />
                    </button>
                    <div className="absolute bottom-10 left-1/2 max-w-xs -translate-x-1/2 transform rounded-lg bg-white p-2 text-sm text-xw-secondary opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
                      <p>Enter text upload it with your post</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedAccount === "youtube" && (
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Enter Post Description
            </label>
            <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-xw-secondary bg-xw-background focus-within:border-xw-primary">
              <textarea
                value={postDescription}
                onChange={(e) => {
                  setPostDescription(e.target.value);
                }}
                placeholder="Enter Post Description"
                className="h-full flex-1 resize-none border-none bg-transparent p-2 focus:border-none focus:outline-none focus:ring-0"
              ></textarea>
              <div className="flex items-center gap-2 p-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-xw-primary">
                  <img
                    src="/icons/add-emoji.svg"
                    alt="add-emoji"
                    className="h-4 w-4"
                  />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-xw-primary">
                  <img
                    src="/icons/hashtag.svg"
                    alt="hash"
                    className="h-4 w-4"
                  />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-xw-primary">
                  <img
                    src="/icons/at-sign.svg"
                    alt="at-sign"
                    className="h-4 w-4"
                  />
                </button>
                <div className="ml-auto">
                  <div className="group relative">
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-xw-primary">
                      <img
                        src="/icons/ideabulb.svg"
                        alt="idea bulb"
                        className="h-5 w-5"
                      />
                    </button>
                    <div className="absolute bottom-10 left-1/2 max-w-xs -translate-x-1/2 transform rounded-lg bg-white p-2 text-sm text-xw-secondary opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
                      <p>Enter text upload it with your post</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <label className="text-white">Upload Media</label>
            </div>
            <div className="flex items-center gap-2">
              {!docArray.includes(selectedOption as string) && <SelectImages />}
              {!docArray.includes(selectedOption as string) && (
                <SelectDocument />
              )}
              <UploadContentModel />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {postMedia.map((media, index) => (
              <div
                key={index}
                className="relative flex h-32 w-32 items-center justify-center rounded-md"
              >
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
                <button
                  onClick={() => handleRemoveMedia(index)}
                  className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <PlusIcon className="h-3 w-3 rotate-45" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <XWRadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex items-center gap-4 mr-0 ml-auto"
                  >
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <XWRadioGroupItem value="public" />
                      </FormControl>
                      <FormLabel className="font-normal">Public</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <XWRadioGroupItem value="private" />
                      </FormControl>
                      <FormLabel className="font-normal">Private</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <XWRadioGroupItem value="unlisted" />
                      </FormControl>
                      <FormLabel className="font-normal">Unlisted</FormLabel>
                    </FormItem>
                  </XWRadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <XWDateTimePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" variant={"primary"} size={"sm"}>
              Schedule <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div> */}
      </div>
    </form>
  );
};

export default PostScheduleForm;
