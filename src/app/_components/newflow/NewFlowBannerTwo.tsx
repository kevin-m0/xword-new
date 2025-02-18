import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import FlowDialog from "./flow/FlowDialog";
import MultiCampaignDialog from "./multi-campaign/MultiCampaignDialog";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";

const NewFlowBannerTwo = () => {
  return (
    <div className="tb:grid-cols-3 grid min-h-[300px] grid-cols-1 gap-5">
      <Card className="tb:row-span-2 tb:col-span-2 from-xw-card col-span-1 h-full w-full border-none bg-gradient-to-t to-blue-500/10">
        <CardHeader className="h-full flex-row items-center justify-between gap-4">
          <div className="flex h-full flex-col gap-4">
            <div>
              <CardTitle className="mb-2 text-3xl">
                Create AI Generated Content With SEO Optimizations.
              </CardTitle>

              <XWGradSeparator />
              <CardDescription className="mt-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                consectetur libero, suscipit fugiat deserunt aliquid.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <FlowDialog>
                <Button variant={"default"} size={"lg"}>
                  Create <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </FlowDialog>
            </div>
          </div>

          <div className="h-full w-full overflow-hidden rounded-lg">
            <Image
              src={
                "https://cdn.pixabay.com/photo/2024/12/30/13/06/moped-9300285_1280.jpg"
              }
              height={100}
              width={100}
              sizes="100vh"
              alt="alt"
              className="h-full w-full object-cover"
            />
          </div>
        </CardHeader>
      </Card>

      <Card className="tb:col-span-1 from-xw-card h-full w-full border-none bg-gradient-to-t to-blue-500/10">
        <CardHeader className="h-full gap-4">
          <div className="h-40 w-full overflow-hidden rounded-lg">
            <Image
              src={
                "https://static.vecteezy.com/system/resources/previews/047/405/381/non_2x/volunteer-community-diverse-bento-grid-illustration-set-we-culture-mindset-2d-image-collage-design-graphics-collection-supportive-inclusive-people-adults-flat-characters-moodboard-layout-vector.jpg"
              }
              height={100}
              width={100}
              sizes="100vh"
              alt="alt"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <CardTitle className="mb-2">
              Create Multiple Content At Once
            </CardTitle>
            <CardDescription>
              We provide you with a wide range of AI-generated content options,
              including blog posts, social media posts, and more.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <MultiCampaignDialog>
              <Button variant={"default"}>
                Try It <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </MultiCampaignDialog>

            <Button variant={"secondary"}>Learn More</Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="tb:col-span-1 h-full w-full border-none">
        <CardHeader className="flex flex-col items-start justify-between gap-2">
          <div>
            <CardTitle className="mb-2 text-lg">
              Customize Your Campaigns
            </CardTitle>
            <CardDescription>
              Add your unique touch to AI-generated content. Start personalizing
              today.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant={"outline"}>Previous</Button>
            <Button variant={"secondary"}>Next</Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default NewFlowBannerTwo;
