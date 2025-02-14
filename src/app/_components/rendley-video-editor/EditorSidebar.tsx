"use client";

import * as React from "react";
import { Mic, Film, X, Image, Crop } from "lucide-react";

import { cn } from "~/utils/utils";
import { Button } from "~/components/ui/button";

import Voiceover from "./Voiceover";
import { useSearchParams } from "next/navigation";
import GenerateImage from "./GenerateImage";
import LayoutSettings from "./LayoutSettings";
import ChatIcon from "~/icons/ChatIcon";
import CaptionsTab from "../videoverse/Editor/CaptionsTab";
import TranscriptEditor from "./TranscriptEditor";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  panel: (
    recording: any,
    rendley: any,
    mainClipId: string,
    mainClipLayer: any,
    handleMainClipId: (id: string) => void,
  ) => React.ReactNode;
}

const items: SidebarItem[] = [
  {
    icon: Film,
    label: "B-Roll",
    panel: (
      recording,
      rendley,
      mainClipId,
      mainClipLayer,
      handleMainClipId,
    ) => (
      <div className="z-50 max-h-[85vh] space-y-4 overflow-y-scroll p-4">
        <TranscriptEditor
          recording={recording}
          rendley={rendley}
          mainClipId={mainClipId}
          mainClipLayer={mainClipLayer}
          handleMainClipId={handleMainClipId}
        />
      </div>
    ),
  },
  {
    icon: ChatIcon,
    label: "Caption",
    panel: (recording, rendley) => (
      <div className="space-y-4 p-4">
        <h2 className="text-lg font-semibold">
          Add animated captions to your video
        </h2>
        <div className="space-y-4">
          <CaptionsTab recording={recording} rendley={rendley} />
        </div>
      </div>
    ),
  },
  {
    icon: Mic,
    label: "Voice-over",
    panel: (recording, rendley) => (
      <Voiceover recording={recording} rendley={rendley} />
    ),
  },

  {
    icon: Image,
    label: "AI Images",
    panel: (recording, rendley) => (
      <div className="space-y-4 p-4">
        <h2 className="text-lg font-semibold">
          Generate AI Images to your video
        </h2>
        <div className="space-y-4">
          <GenerateImage recording={recording} rendley={rendley} />
        </div>
      </div>
    ),
  },
  {
    icon: Crop,
    label: "Layout",
    panel: (recording, rendley, mainClipId) => (
      <div className="space-y-4 p-4">
        <h2 className="text-lg font-semibold">Layout Settings</h2>
        <div className="space-y-4">
          <LayoutSettings
            recording={recording}
            rendley={rendley}
            mainClipId={mainClipId}
          />
        </div>
      </div>
    ),
  },
];

interface EditorSidebarProps {
  recording: any;
  rendley: any;
  mainClipId: string;
  mainClipLayer: any;
  handleMainClipId: (id: string) => void;
}

export function EditorSidebar({
  recording,
  rendley,
  mainClipId,
  mainClipLayer,
  handleMainClipId,
}: EditorSidebarProps) {
  const searchParams = useSearchParams();
  const [activePanel, setActivePanel] = React.useState<number | null>(0);

  React.useEffect(() => {
    const voiceOver = searchParams.get("voice-over");
    const broll = searchParams.get("broll");

    if (voiceOver === "true") {
      setActivePanel(2);
    } else if (broll === "true") {
      setActivePanel(0);
    }
  }, []);

  return (
    <div className="flex">
      <div className="flex w-[72px] flex-col items-center gap-1 border-r border-white/10 p-2">
        {items.map((item, index) => {
          const isActive = activePanel === index;
          return (
            <Button
              key={item.label}
              size="icon"
              className={cn(
                "h-[72px] w-full flex-col items-center justify-center gap-1 rounded-lg p-0",
                isActive && "bg-white/10",
              )}
              onClick={() => setActivePanel(isActive ? null : index)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
      {activePanel !== null && items[activePanel]?.panel && (
        <div className="mr-4 w-full rounded-none border-0 bg-[#121315]">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <span className="font-medium">{items[activePanel].label}</span>
            <Button
              size="icon"
              className="h-6 w-6 bg-white/10 hover:bg-transparent"
              onClick={() => setActivePanel(null)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          {/* Pass recording to the panel function */}
          {items[activePanel]?.panel(
            recording,
            rendley,
            mainClipId,
            mainClipLayer,
            handleMainClipId,
          )}
        </div>
      )}
    </div>
  );
}
