import React, { useEffect, useState } from "react";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { CheckCheckIcon, Info } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { trpc } from "~/trpc/react";

const VideoVerseTranscriptTab = ({ videoProject }: any) => {
  const [chapters, setChapters] = useState([]);
  const [copyDescription, setCopyDescription] = useState(false);
  const [copyChapters, setCopyChapters] = useState(false);
  const [copyTranscript, setCopyTranscript] = useState(false);

  const { mutateAsync: updateVideoProjectTitle } =
    trpc.videoProject.updateVideoProjectTitle.useMutation();

  const { mutateAsync: updateVideoProjectDescription } =
    trpc.videoProject.updateVideoProjectDescription.useMutation();

  function formatTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function formatChapters(chapters: any) {
    return chapters
      .map((chapter: any) => {
        const time = formatTime(chapter.start_time);
        return `${time} ${chapter.ChapterName}`;
      })
      .join("\n");
  }

  useEffect(() => {
    if (videoProject) {
      const chapters = JSON.parse(videoProject?.ytChapters);
      const ch = formatChapters(chapters.chapters);
      setChapters(ch);
    }
  }, [videoProject, formatChapters]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard:", text);
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
    }
  };

  const handleCopy = (text: string, field: string) => {
    if (field === "description") {
      setCopyDescription(true);
      copyToClipboard(text);
      setTimeout(() => {
        setCopyDescription(false);
      }, 2000);
    } else if (field === "chapters") {
      setCopyChapters(true);
      copyToClipboard(text);
      setTimeout(() => {
        setCopyChapters(false);
      }, 2000);
    } else if (field === "transcript") {
      setCopyTranscript(true);
      copyToClipboard(text);
      setTimeout(() => {
        setCopyTranscript(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-10">
      {/* Video Block */}
      <div className="w-full">
        <video
          src={videoProject?.videoUrl}
          className="h-[500px] w-full bg-black"
          controls
          loop
          muted
        ></video>

        <div className="mt-5 flex items-center gap-2">
          <XWSecondaryButton
            size="sm"
            className2="text-sm xw-premium-div w-fit text-sm px-3"
          >
            <Image
              src={"/icons/calender.svg"}
              alt={"Publish on Social"}
              width={16}
              height={16}
            />
            Publish on Social
          </XWSecondaryButton>
          <Link target="_blank" href={`${videoProject?.videoUrl}`}>
            <XWSecondaryButton
              size="sm"
              className2="text-sm xw-premium-div w-fit text-sm px-3"
            >
              <Image
                src={"/icons/download.svg"}
                alt={"Download HD"}
                width={16}
                height={16}
              />
              Download HD
            </XWSecondaryButton>
          </Link>

          <XWSecondaryButton
            size="sm"
            className2="text-sm xw-premium-div w-fit text-sm px-3"
            onClick={() => {
              window.location.href = `/videoverse/${videoProject?.id}/editor?voice-over=true`;
            }}
          >
            <Image
              src={"/icons/mic.svg"}
              alt={"Add AI voice-over"}
              width={16}
              height={16}
            />
            Add AI voice-over
          </XWSecondaryButton>

          <XWSecondaryButton
            size="sm"
            className2="text-sm xw-premium-div w-fit text-sm px-3"
            onClick={() => {
              window.location.href = `/videoverse/${videoProject?.id}/editor?broll=true`;
            }}
          >
            <Image
              src={"/icons/movie.svg"}
              alt={"Add B-Rolls"}
              width={16}
              height={16}
            />
            Add B-Rolls
          </XWSecondaryButton>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Title</h1>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={"sm"} variant={"ghost"} className="rounded-full">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is the title of the video</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="border-xw-muted-foreground xw-premium-div flex h-fit rounded-lg border p-2">
          <textarea
            rows={4}
            placeholder="Enter title here..."
            className="h-full w-full flex-1 resize-none border-none bg-transparent outline-none focus:ring-0"
            defaultValue={videoProject?.title}
            onChange={(e) => {
              updateVideoProjectTitle({
                id: videoProject?.id,
                title: e.target.value,
              });
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Description</h1>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={"sm"} variant={"ghost"} className="rounded-full">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI generated description for your video</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="ml-auto mr-0 flex items-center gap-2">
            {copyDescription ? (
              <XWSecondaryButton size="sm" className2="xw-premium-div">
                <CheckCheckIcon className="h-4 w-4 text-green-500" />
              </XWSecondaryButton>
            ) : (
              <XWSecondaryButton
                size="sm"
                className2="xw-premium-div"
                onClick={() => {
                  handleCopy(videoProject?.description, "description");
                }}
              >
                <Image
                  src={"/icons/copy.svg"}
                  alt="copy"
                  width={16}
                  height={16}
                />
                Copy
              </XWSecondaryButton>
            )}

            {/* <XWSecondaryButton size="sm" className2="xw-premium-div">
              <Image
                src={"/icons/sparkles.svg"}
                alt="sparkles"
                width={16}
                height={16}
              />
              Regenerate
            </XWSecondaryButton> */}
          </div>
        </div>

        <div className="border-xw-muted-foreground xw-premium-div flex h-fit rounded-lg border p-2">
          <textarea
            rows={4}
            placeholder="Enter description here..."
            className="h-full w-full flex-1 resize-none border-none bg-transparent outline-none focus:ring-0"
            defaultValue={videoProject?.description}
            onChange={(e) => {
              updateVideoProjectDescription({
                id: videoProject?.id,
                description: e.target.value,
              });
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Chapters</h1>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={"sm"} variant={"ghost"} className="rounded-full">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI generated Youtube Chapters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="ml-auto mr-0 flex items-center gap-2">
            {copyChapters ? (
              <XWSecondaryButton size="sm" className2="xw-premium-div">
                <CheckCheckIcon className="h-4 w-4 text-green-500" />
                Copied
              </XWSecondaryButton>
            ) : (
              <XWSecondaryButton
                size="sm"
                className2="xw-premium-div"
                onClick={() => {
                  handleCopy(videoProject?.ytChapters, "chapters");
                }}
              >
                <Image
                  src={"/icons/copy.svg"}
                  alt="copy"
                  width={16}
                  height={16}
                />
                Copy
              </XWSecondaryButton>
            )}

            {/* <XWSecondaryButton size="sm" className2="xw-premium-div">
              <Image
                src={"/icons/sparkles.svg"}
                alt="sparkles"
                width={16}
                height={16}
              />
              Regenerate
            </XWSecondaryButton> */}
          </div>
        </div>

        <div className="border-xw-muted-foreground xw-premium-div flex h-fit rounded-lg border p-2">
          <textarea
            rows={8}
            placeholder="Enter chapters here..."
            className="h-full w-full flex-1 resize-none border-none bg-transparent outline-none focus:ring-0"
            defaultValue={chapters}
          />
        </div>
      </div>

      {/* Transcript Block */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Transcript</h1>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size={"sm"} variant={"ghost"} className="rounded-full">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a tooltip</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="ml-auto mr-0 flex items-center gap-2">
          {copyTranscript ? (
            <XWSecondaryButton size="sm" className2="xw-premium-div">
              <CheckCheckIcon className="h-4 w-4 text-green-500" />
              Copied
            </XWSecondaryButton>
          ) : (
            <XWSecondaryButton
              size="sm"
              className2="xw-premium-div"
              onClick={() => {
                handleCopy(videoProject?.transcript, "transcript");
              }}
            >
              <Image
                src={"/icons/copy.svg"}
                alt="copy"
                width={16}
                height={16}
              />
              Copy
            </XWSecondaryButton>
          )}
        </div>
      </div>
      <div className="border-xw-muted-foreground xw-premium-div flex h-fit rounded-lg border p-2">
        <textarea
          rows={20}
          placeholder="Enter chapters here..."
          className="h-full w-full flex-1 resize-none border-none bg-transparent outline-none focus:ring-0"
          defaultValue={videoProject?.transcript}
        />
      </div>
      {/* <div className="flex flex-col gap-10">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border-l-2 py-2 px-5 border-l-white"
          >
            <div className="flex gap-5">
              <h1 className="text-xl font-semibold">Adam Sandler</h1>
              <span className="text-sm text-xw-muted">00:00:00 - 00:00:10</span>
            </div>

            <p className="text-xw-muted-foreground">
              Rock. I remember Chris was in Vegas, and I went to see him with
              Nicholson and Jim Brooks.
            </p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default VideoVerseTranscriptTab;
