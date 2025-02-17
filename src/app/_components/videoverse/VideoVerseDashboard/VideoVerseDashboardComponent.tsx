"use client";
import React, { useState } from "react";
import { Trash } from "lucide-react";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import XWTabs from "~/components/reusable/XWTabs";
import VideoVerseTranscriptTab from "./VideoVerseTranscriptTab";
import { Separator } from "~/components/ui/separator";
import VideoVerseMagicChat from "./VideoVerseMagicChat";
import VideoVerseAIContentScreen from "./VideoVerseAIContentScreen";
import VideoVerseClipsTab from "./VideoVerseClipsTab";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { Dialog, DialogHeader } from "~/components/reusable/xw-dialog";
import { DialogDescription } from "~/components/ui/dialog";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";
import { toast } from "sonner";
import { trpc } from "~/trpc/react";

const VideoVerseDashboardComponent = () => {
  const [activeTab, setActiveTab] = useState("transcript");

  const params = useParams();
  const router = useRouter();

  const { mutateAsync: deleteVideoProject } =
    trpc.videoProject.deleteVideoProject.useMutation();

  const { data: videoProject, isLoading } =
    trpc.videoProject.getVideoProjectById.useQuery(
      {
        id: params["video-id"] as string,
      },
      {
        enabled: !!params["video-id"],
      },
    );

  const tabs = [
    {
      id: "transcript",
      label: "Transcript",
      icon: "/icons/magic.svg",
    },
    {
      id: "clips",
      label: "Clips",
      icon: "/icons/youtube-logo.svg",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "transcript":
        return <VideoVerseTranscriptTab videoProject={videoProject} />;
      case "magic-chat":
        return <VideoVerseMagicChat />;
      case "ai-content":
        return <VideoVerseAIContentScreen />;
      case "clips":
        return <VideoVerseClipsTab />;
      default:
        return <> </>;
    }
  };

  return (
    <div className="flex min-h-dvh flex-col gap-10">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 p-5">
        {/* VideoVerse Dashboard Header */}
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div>
              <XWSecondaryButton
                size="icon"
                rounded="full"
                onClick={() => {
                  router.push("/videoverse");
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </XWSecondaryButton>
            </div>
            <h1 className="text-2xl font-semibold">{videoProject?.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <XWSecondaryButton>
                  <Trash className="h-4 w-4 text-red-700" />
                </XWSecondaryButton>
              </DialogTrigger>

              <DialogContent className="bg-xw-sidebar flex w-full max-w-md flex-col gap-5">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Delete Video Project
                  </DialogTitle>
                  <DialogDescription className="text-xw-muted text-sm">
                    This action cannot be undone. Are you sure you want to
                    delete this video project?
                  </DialogDescription>
                </DialogHeader>

                <XWGradSeparator />

                <Button
                  variant={"destructive"}
                  onClick={() =>
                    deleteVideoProject({
                      id: videoProject?.id as string,
                    }).then(() => {
                      toast.success("Video Project deleted successfully");
                      router.push("/videoverse");
                    })
                  }
                >
                  Delete
                </Button>
                <XWGradSeparator />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Adding tabs & actions */}
        <div className="mt-10 flex items-center justify-between gap-2">
          <div>
            <XWTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>
          <div>
            <Button
              variant={"default"}
              size={"sm"}
              className="flex items-center gap-2"
              onClick={() => {
                window.location.href = `/videoverse/${params["video-id"]}/editor`;
              }}
            >
              Edit your video
              <Image
                src={"/icons/magic.svg"}
                alt="Magic"
                width={16}
                height={16}
              />
            </Button>
          </div>
        </div>

        <Separator />

        {renderTabContent()}
      </div>
    </div>
  );
};

export default VideoVerseDashboardComponent;
