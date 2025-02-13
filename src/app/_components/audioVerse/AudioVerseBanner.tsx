import React from "react";
import { Button } from "~/components/ui/button";
import NewAudioFlow from "../audioflow/NewAudioFlow";
import MultiCampaignDynamicDialog from "../newflow/multi-campaign/MultiCampaignDynamicDialog";

const AudioVerseBanner = () => {
  return (
    <div className="relative py-5">
      <div
        className="relative rounded-2xl bg-gradient-to-r from-white/10 via-white/30 to-white/60 p-[1px]"
        style={{
          backgroundImage: ` url("/banners/audioversebanner.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-2xl bg-black/40 p-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-medium capitalize leading-tight text-white">
                Turn Audio into Content
              </h1>
              <p className="text-xw-muted-foreground mt-4">
                Transform voice recordings or podcasts into diverse content
                formats!
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <NewAudioFlow />
              <MultiCampaignDynamicDialog source="audio">
                <Button variant="secondary">Create Multiple</Button>
              </MultiCampaignDynamicDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioVerseBanner;
