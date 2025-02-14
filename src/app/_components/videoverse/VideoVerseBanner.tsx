import React from "react";
import MultiCampaignDynamicDialog from "../newflow/multi-campaign/MultiCampaignDynamicDialog";
import { Button } from "~/components/ui/button";
import NewVideoFlow from "./videoflow/NewVideoFlow";

const VideoVerseBanner = () => {
  return (
    <div className="relative py-5">
      <div className="relative rounded-2xl bg-gradient-to-r from-purple-500/10 via-purple-500/80 to-purple-500/60 p-[1px] shadow-xl">
        <div
          className="flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-2xl p-8"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url("/banners/videoversebanner.jpeg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-medium capitalize leading-tight text-white">
                Generate Content in seconds
              </h1>
              <p className="text-xw-muted-foreground mt-4 max-w-3xl">
                Create any type of content with just a few easy clicks!
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <NewVideoFlow />
              <MultiCampaignDynamicDialog source="video">
                <Button variant="secondary">Create Multiple</Button>
              </MultiCampaignDynamicDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoVerseBanner;
