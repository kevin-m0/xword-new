"use client";
import React from "react";
import TopbarComponent from "../../topbar/TopbarComponent";
import XWSecondaryButton from "../../reusable/XWSecondaryButton";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Share, Pencil } from "lucide-react";
import Image from "next/image";
import XWTabs from "../../reusable/XWTabs";
import { useState } from "react";
import AudioVerseTranscriptTab from "./AudioVerseTranscriptTab";
import AudioVerseMagicChatTab from "./AudioVerseMagicChatTab";
import AudioVerseAIContentTab from "./AudioVerseAIContentTab";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { useAtom } from "jotai";
import { contentResponseAtom } from "@/atoms";

const AudioVerseDashboardComponent = () => {
  const [activeTab, setActiveTab] = useState("transcript");
  const [contentResponse, setContentResponse] = useAtom(contentResponseAtom);

  const params = useParams();
  const router = useRouter();

  const { data: audioProject, isLoading } =
    trpc.audioProject.getAudioProjectById.useQuery(
      {
        id: params["audioProjectId"] as string,
      },
      {
        enabled: !!params,
      },
    );

  const tabs = [
    {
      id: "transcript",
      label: "Transcript",
      icon: "/icons/mic.svg",
    },
    {
      id: "magicchat",
      label: "MagicChat",
      icon: "/icons/chatoval.svg",
    },
    {
      id: "aicontent",
      label: "AIContent",
      icon: "/icons/magic.svg",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "transcript":
        return <AudioVerseTranscriptTab audioProject={audioProject} />;
      case "magicchat":
        return <AudioVerseMagicChatTab audioProject={audioProject} />;
      case "aicontent":
        return <AudioVerseAIContentTab audioProject={audioProject} />;
      default:
        return <AudioVerseTranscriptTab />;
    }
  };

  return (
    <div className="flex min-h-dvh flex-col gap-10">
      <TopbarComponent />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 p-5">
        {/* Audioverse Dashboard Header */}
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div>
              <XWSecondaryButton
                size="sm"
                onClick={() => {
                  router.push("/audioverse");
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </XWSecondaryButton>
            </div>
            <h1 className="text-2xl font-semibold">{audioProject?.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="xw_ghost" size="icon">
              <Share className="h-4 w-4" />
            </Button>

            <Button variant="xw_ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>

            <Button variant="xw_ghost" size="icon">
              <Image
                src="/icons/trashbin.svg"
                alt="Delete"
                width={16}
                height={16}
              />
            </Button>
          </div>
        </div>

        {/* Audioverse tabs and action */}
        <div className="flex items-center justify-between">
          <div>
            <XWTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <Button
            variant={"primary"}
            size={"sm"}
            className="flex items-center gap-2"
          >
            Advance Creation
            <Image
              src={"/icons/magic.svg"}
              alt="Magic"
              width={16}
              height={16}
            />
          </Button>
        </div>

        <Separator />

        {/* Tab Content */}
        {audioProject && renderTabContent()}
      </div>
    </div>
  );
};

export default AudioVerseDashboardComponent;
