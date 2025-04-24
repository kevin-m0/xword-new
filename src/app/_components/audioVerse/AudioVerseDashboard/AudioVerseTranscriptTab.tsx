"use client";
import React from "react";
import { SubtitleDisplay } from "./SubtitleDisplay";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import ReactPlayer from "react-player";
import { getAwsUrl } from "~/lib/get-aws-url";
import ReactAudioPlayer from "react-audio-player";

const AudioVerseTranscriptTab = ({ audioProject }: any) => {
  const fileUrl = getAwsUrl(audioProject?.storageKey);
  console.log(fileUrl);
  return (
    <div className="relative">
      <div className="fixed bottom-10 right-10">
        {audioProject?.storageKey.startsWith("https") ? (
          <ReactPlayer
            height={300}
            width={500}
            url={audioProject?.storageKey}
          />
        ) : (
          <ReactPlayer url={fileUrl} controls width={500} />
        )}
      </div>
      <div className="flex flex-col gap-10">
        <SubtitleDisplay subs={audioProject?.subtitles} />
      </div>
    </div>
  );
};

export default AudioVerseTranscriptTab;
