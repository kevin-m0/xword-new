"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { Button } from "~/components/ui/button";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";
import { GallaryIcon } from "~/icons";
import { Loader } from "lucide-react";
import React from "react";
import { ImageData } from "@prisma/client";
import { postMediaAtom } from "~/atoms/calendarAtoms";
import { useAtom } from "jotai";
import { useOrganization } from "@clerk/nextjs";
import { trpc } from "~/trpc/react";
import SearchBarComponent from "~/components/topbar/SearchBarComponent";

const SelectImages: React.FC<{ trigger?: React.ReactNode }> = ({ trigger }) => {
  const { organization: activeSpace } = useOrganization();
  const [postMedia, setPostMedia] = useAtom(postMediaAtom);

  const { data: generatedImages, isLoading: isImagesLoading } =
    trpc.image.getGeneratedImagesWithUrls.useQuery(
      {
        workspaceId: activeSpace?.id || "",
      },
      {
        enabled: !!activeSpace?.id,
        staleTime: 0,
      },
    );

  // Toggles image selection by adding or removing the Media object
  const toggleImageSelection = (image: ImageData) => {
    setPostMedia((prev) => {
      const isSelected = prev.some(
        (media) =>
          media.type === "image" &&
          media.source === "key" &&
          media.content === image.imageKey,
      );
      if (isSelected) {
        // Remove the selected media
        return prev.filter(
          (media) =>
            !(
              media.type === "image" &&
              media.source === "key" &&
              media.content === image.imageKey
            ),
        );
      } else {
        // Add the new media
        return [
          ...prev,
          {
            type: "image",
            source: "key",
            content: image.imageKey as string,
          },
        ];
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" size="sm">
            Select Images <GallaryIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex w-full max-w-[1200px] flex-col gap-5">
        <DialogHeader className="flex flex-row items-center gap-5 text-left">
          <div>
            <DialogTitle className="mb-0 text-2xl font-semibold">
              Select Images
            </DialogTitle>
            <DialogDescription className="mt-2">
              Choose images from your media library to upload.
            </DialogDescription>
          </div>
        </DialogHeader>

        <XWGradSeparator />

        <div>
          <div className="mb-6 flex items-center justify-between gap-5">
            <SearchBarComponent />
          </div>

          {isImagesLoading ? (
            <div className="flex justify-center">
              <Loader className="h-6 w-6 animate-spin text-white" />
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {generatedImages?.images?.map((image: ImageData) => (
                <div
                  key={image.id}
                  onClick={() => toggleImageSelection(image)}
                  className={`relative cursor-pointer border-2 ${
                    postMedia.some(
                      (media) =>
                        media.type === "image" &&
                        media.source === "key" &&
                        media.content === image.imageKey,
                    )
                      ? "border-blue-500"
                      : "border-transparent"
                  } overflow-hidden rounded-lg shadow-sm hover:shadow-md`}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_BASE_URL}${image.imageKey}`}
                    alt={image.prompt}
                    className="h-36 w-full object-cover sm:h-40 lg:h-48"
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-blue-500/30 ${
                      postMedia.some(
                        (media) =>
                          media.type === "image" &&
                          media.source === "key" &&
                          media.content === image.imageKey,
                      )
                        ? "opacity-100"
                        : "opacity-0"
                    } transition-opacity`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="h-8 w-8 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectImages;
