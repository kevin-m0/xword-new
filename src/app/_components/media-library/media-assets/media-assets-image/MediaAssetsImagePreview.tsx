"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { trpc } from "~/trpc/react";
import { getAwsUrl } from "~/lib/get-aws-url";

const MediaAssetImagePreview = ({ imageKey }: { imageKey: string }) => {
  console.log("key---", imageKey);
  console.log("url---", getAwsUrl(imageKey));
  
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="w-full justify-start">
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle></DialogTitle>
          <DialogHeader>
            <p className="text-sm text-xw-muted">Image Preview</p>
          </DialogHeader>
          <div className="mt-4">
            
              <Image
                src={getAwsUrl(imageKey) as string}
                height={400}
                width={400}
                sizes="100vw"
                alt="Previewed Image"
                className="h-auto w-full object-contain"
              />
            
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaAssetImagePreview;
