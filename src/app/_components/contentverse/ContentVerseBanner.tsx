import React from "react";
import FlowDialog from "../newflow/flow/FlowDialog";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import MultiCampaignDynamicDialog from "../newflow/multi-campaign/MultiCampaignDynamicDialog";

const ContentVerseBanner = () => {
  return (
    <div className="relative py-5">
      <div
        className="relative rounded-2xl p-[1px]"
        style={{
          backgroundImage: ` url("/banners/contentversebanner.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-2xl bg-black/40 p-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-medium capitalize leading-tight text-white">
                Generate content in seconds
              </h1>
              <p className="text-xw-muted-foreground mt-4">
                Generate content for your website, blog, or social media in
                seconds
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <FlowDialog>
                <Button variant={"default"} size={"lg"}>
                  Create <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </FlowDialog>
              <MultiCampaignDynamicDialog source="doc">
                <Button variant="secondary">Create Multiple</Button>
              </MultiCampaignDynamicDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentVerseBanner;
