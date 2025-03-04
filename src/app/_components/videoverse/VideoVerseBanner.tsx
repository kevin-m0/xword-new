import React from "react";
import MultiCampaignDynamicDialog from "../newflow/multi-campaign/MultiCampaignDynamicDialog";
import { Button } from "~/components/ui/button";
import NewVideoFlow from "./videoflow/NewVideoFlow";
import BeamsBackground from "../background";

const VideoVerseBanner = () => {
  return (
    <div className="relative py-5">
      <BeamsBackground>
        <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-medium capitalize leading-tight text-white">
              Generate Content in seconds
            </h1>
            <p className="mt-4 max-w-3xl text-xl text-xw-muted-foreground">
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
      </BeamsBackground>
    </div>
  );
};

export default VideoVerseBanner;
