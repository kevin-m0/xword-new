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
import ReactAudioPlayer from "react-audio-player";
import { trpc } from "~/trpc/react";
import { MediaAssetsAudio } from "~/types/media.types";

const MediaAssetAudioPreview = ({ audio }: { audio: MediaAssetsAudio }) => {
  const {
    data: fileUrl,
    isLoading,
    isError,
  } = trpc.aws.getObjectURL.useQuery(
    {
      key: audio.audioKey as string,
    },
    {
      enabled: !!audio.audioKey,
    },
  );

  console.log("Audio Key:", audio.audioKey);

  console.log("fileUrl", fileUrl);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size={"sm"} variant="ghost" className="w-full justify-start">
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{audio.text}</DialogTitle>
            <p className="text-sm text-xw-muted">
              Uploaded At: {new Date(audio.createdAt).toLocaleString()}
            </p>
          </DialogHeader>
          <div className="mt-4">
            {isLoading && (
              <p className="text-center text-xw-muted">Loading audio...</p>
            )}
            {isError && (
              <p className="text-center text-red-500">
                Failed to load audio. Please try again.
              </p>
            )}
            {fileUrl && <ReactAudioPlayer src={fileUrl} autoPlay controls />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaAssetAudioPreview;
