"use client";

import React, { useState } from "react";
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
import { getAwsUrl } from "~/lib/get-aws-url";

const MediaAssetAudioPreview = ({ audio }: { audio: MediaAssetsAudio }) => {
  const [open, setOpen] = useState(false);
  const fileUrl = getAwsUrl(audio.audioKey);

  console.log("Audio Key:", audio.audioKey);
  console.log("fileUrl", fileUrl);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size={"sm"}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setOpen(true)}
          >
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[800px] max-w-3xl">
          <DialogHeader>
            <DialogTitle>Audio Preview</DialogTitle>
          </DialogHeader>
          <div className="gap-4 w-full mt-2">
            <div className="mb-3">
              {fileUrl && (
                <ReactAudioPlayer className="w-full" src={fileUrl} controls />
              )}
            </div>
            <div className="gap-4">
              <p>
                <span className="text-base font-bold text-orange-600">
                  Transcription:{" "}
                </span>
                {audio.text}
              </p>
              <p className="text-sm text-xw-muted mt-2">
                Uploaded At: {new Date(audio.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-end w-full">
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaAssetAudioPreview;
