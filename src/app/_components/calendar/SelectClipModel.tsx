"use client";

import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { Button } from "~/components/ui/button";
import {
  XWDropdown,
  XWDropdownTrigger,
  XWDropdownContent,
} from "~/components/reusable/xw-dropdown";
import {
  MoreHorizontal,
  PlayCircle,
  ArrowLeft,
  ArrowRight,
  Copy,
} from "lucide-react";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";
import XWGradDiv from "~/components/reusable/XWGradDiv";
import { Separator } from "~/components/ui/separator";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { projectDocs } from "~/lib/constant/constants";
import SearchBarComponent from "~/components/topbar/SearchBarComponent";

const SelectClipModel = ({ trigger }: { trigger?: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<"select" | "confirm">("select");
  const videoDocs = projectDocs.filter((doc) => doc.type === "video");

  const selectedClip = {
    id: 1,
    title: "Embracing Parenthood: The Joys of Older Parenthood",
    duration: "00:56",
    transcript:
      "Yeah pretty great So is it does it feel strange to have a child while this craziness is going does it feel you've had children before is this any weirder It's actually think it's better Being older and having a kid I appreciate more...",
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant={"default"} size={"sm"}>
            Select Clip <PlayCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex w-full max-w-[1200px] flex-col gap-5">
        <DialogHeader className="flex flex-row items-center gap-5 text-left">
          <div className="flex items-center gap-3">
            {activeTab === "confirm" && (
              <XWSecondaryButton
                onClick={() => setActiveTab("select")}
                size="icon"
                rounded="full"
              >
                <ArrowLeft className="h-4 w-4" />
              </XWSecondaryButton>
            )}
            {activeTab === "select" && (
              <XWSecondaryButton
                onClick={() => setActiveTab("confirm")}
                size="icon"
                rounded="full"
              >
                <ArrowRight className="h-4 w-4" />
              </XWSecondaryButton>
            )}
          </div>

          <div>
            <DialogTitle className="mb-0 text-2xl font-semibold">
              {activeTab === "select" ? "Select clip" : "Confirm clip"}
            </DialogTitle>
            <DialogDescription className="mt-2">
              {activeTab === "select"
                ? "Choose a clip from your project to schedule"
                : "Review and confirm your clip selection"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <XWGradSeparator />

        {activeTab === "select" ? (
          <>
            <div className="mb-6 flex items-center justify-between gap-5">
              <SearchBarComponent />
            </div>

            <div className="tb:grid-cols-4 xw-scrollbar grid max-h-[60vh] grid-cols-1 gap-5 overflow-y-auto">
              {videoDocs.map((doc, index) => (
                <XWGradDiv
                  key={index}
                  className="flex cursor-pointer flex-col items-center overflow-hidden hover:opacity-80"
                >
                  <div className="w-full border-b border-xw-secondary">
                    <div className="relative w-full">
                      <Image
                        src={doc.image}
                        alt={doc.title}
                        width={100}
                        height={100}
                        sizes="100vh"
                        className="h-auto w-full object-cover"
                      />
                      <div className="absolute left-1 top-1">
                        <span className="rounded-sm bg-xw-sidebar px-2 py-1 text-xs text-white">
                          {doc.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-2 p-5">
                    <div className="flex-1">
                      <h1 className="font-semibold">{doc.title}</h1>
                      <div className="flex flex-col text-xs text-xw-muted">
                        <span>
                          Last edited:{" "}
                          {format(new Date(doc.lastEdited), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>

                    <XWDropdown>
                      <XWDropdownTrigger asChild>
                        <Button size={"icon"} variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </XWDropdownTrigger>
                      <XWDropdownContent align="end">
                        <div className="flex flex-col">
                          {/* Add your dropdown actions here */}
                        </div>
                      </XWDropdownContent>
                    </XWDropdown>
                  </div>
                </XWGradDiv>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <h2 className="text-2xl font-semibold">
                <span className="text-xw-muted">#{selectedClip.id}</span> -{" "}
                {selectedClip.title}
              </h2>

              <div className="flex min-h-[500px] gap-6 rounded-lg border border-xw-secondary bg-xw-background p-2">
                <Image
                  src="/icons/musk.png"
                  alt={selectedClip.title}
                  className="h-full w-full max-w-[300px]"
                  height={100}
                  width={100}
                />

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex w-full items-center gap-2">
                    <div>
                      <Image
                        src={"/icons/captions.svg"}
                        alt="captions"
                        width={16}
                        height={16}
                      />
                    </div>
                    <h3 className="text-lg font-semibold">Transcript</h3>
                    <div className="ml-auto mr-0">
                      <XWSecondaryButton
                        size="sm"
                        className2="text-xs xw-premium-div w-fit px-3"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Transcript
                      </XWSecondaryButton>
                    </div>
                  </div>

                  <Separator className="my-4" />
                  <span className="mb-2 text-xs text-xw-muted">
                    [01:37-02:33]
                  </span>
                  <p className="text-sm text-xw-muted-foreground">
                    {selectedClip.transcript}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="default" size={"sm"}>
                Select Clip
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectClipModel;
