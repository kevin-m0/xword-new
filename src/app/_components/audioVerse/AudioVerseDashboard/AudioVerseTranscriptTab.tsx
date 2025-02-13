import React from "react";
import XWSecondaryButton from "../../reusable/XWSecondaryButton";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { SubtitleDisplay } from "./SubtitleDisplay";

const AudioVerseTranscriptTab = ({ audioProject }: any) => {
  return (
    <div className="flex flex-col gap-10">
      {/* Video Block */}
      <div className="max-w-2xl w-full">
        <div className="h-[300px] w-full bg-xw-sidebar rounded-lg"></div>

        <div className="flex items-center gap-2 mt-5">
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
