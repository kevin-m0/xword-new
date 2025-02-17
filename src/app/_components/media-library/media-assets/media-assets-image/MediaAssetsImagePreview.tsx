"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { trpc } from "~/trpc/react";

const MediaAssetImagePreview = ({ imageKey }: { imageKey: string }) => {
  const {
    data: fileUrl,
    isLoading,
    isError,
  } = trpc.aws.getObjectURL.useQuery(
    { key: imageKey },
    {
      enabled: !!imageKey,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );

  console.log("Image Key:", imageKey);
  console.log("File URL:", fileUrl);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="w-full justify-start">
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <p className="text-sm text-xw-muted">Image Preview</p>
          </DialogHeader>
          <div className="mt-4">
            {isLoading && (
              <p className="text-center text-xw-muted">Loading image...</p>
            )}
            {isError && (
              <p className="text-center text-red-500">
                Failed to load image. Please try again.
              </p>
            )}
            {fileUrl ? (
              <Image
                src={fileUrl}
                height={400}
                width={400}
                sizes="100vw"
                alt="Previewed Image"
                className="h-auto w-full object-contain"
              />
            ) : (
              !isLoading &&
              !isError && (
                <p className="text-center text-xw-muted">
                  No image available for preview.
                </p>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaAssetImagePreview;
