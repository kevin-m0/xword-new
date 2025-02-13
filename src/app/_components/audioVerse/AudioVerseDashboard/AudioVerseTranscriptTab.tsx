import React from "react";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { SubtitleDisplay } from "./SubtitleDisplay";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";

const AudioVerseTranscriptTab = ({ audioProject }: any) => {
  return (
    <div className="flex flex-col gap-10">
      {/* Video Block */}
      <div className="w-full max-w-2xl">
        <div className="bg-xw-sidebar h-[300px] w-full rounded-lg"></div>

        <div className="mt-5 flex items-center gap-2">
          <XWSecondaryButton className2="text-sm xw-premium-div">
            <Image
              src={"/icons/edit-pen.svg"}
              alt="Mic"
              width={16}
              height={16}
            />
            Edit Transcript
          </XWSecondaryButton>

          <XWSecondaryButton className2="text-sm xw-premium-div">
            <Image
              src={"/icons/edit-copy.svg"}
              alt="copy"
              width={16}
              height={16}
            />
            Copy Transcript
          </XWSecondaryButton>

          <XWSecondaryButton className2="text-sm xw-premium-div">
            <Image
              src={"/icons/download.svg"}
              alt="download"
              width={16}
              height={16}
            />
            Download Transcript
          </XWSecondaryButton>
        </div>
      </div>

      <Separator />

      {/* Transcript Block */}
      <SubtitleDisplay subs={audioProject?.subtitles} />
    </div>
  );
};

export default AudioVerseTranscriptTab;
