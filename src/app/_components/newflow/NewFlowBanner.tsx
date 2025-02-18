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

const NewFlowBanner = () => {
  return (
    <div className="tb:grid-cols-2 grid min-h-[350px] grid-cols-1 gap-5">
      <Card className="from-xw-card via-xw-card h-full w-full border-none bg-gradient-to-t to-blue-500/10">
        <CardHeader className="h-full flex-row items-center justify-between gap-4">
          <div className="flex h-full flex-col justify-between gap-2">
            <div>
              <CardTitle className="mb-2 text-3xl">
                Create AI Generated Content With Seo Optimizations.
              </CardTitle>
              <CardDescription>
                We provide you with a wide range of AI generated content
                options, including blog posts, social media posts, and more.
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

      <Card className="from-xw-card via-xw-card h-full w-full border-none bg-gradient-to-t to-blue-500/10">
        <CardHeader className="h-full flex-row items-center justify-between gap-4">
          <div className="flex h-full flex-col justify-between gap-2">
            <div>
              <CardTitle className="mb-2 text-3xl">
                Create Multiple Content At Once
              </CardTitle>
              <CardDescription>
                We provide you with a wide range of AI generated content
                options, including blog posts, social media posts, and more.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <MultiCampaignDialog>
                <Button variant={"default"} size={"lg"}>
                  Try It <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </MultiCampaignDialog>

              <Button variant={"secondary"} size={"lg"}>
                Learn More
              </Button>
            </div>
          </div>

          <div className="h-full w-full overflow-hidden rounded-lg">
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
        </CardHeader>
      </Card>

      {/* <Card className=' border-none tb:col-span-2 bg-gradient-to-t from-xw-card to-blue-500/10'>
                <CardHeader className='flex-row gap-2 items-center'>
                    <XWInput
                        placeholder='Type Something To Generate...'
                        className='flex-1 w-full'
                    />
                    <div>
                        <Button variant={"primary"}>
                            Generate
                        </Button>
                    </div>
                </CardHeader>
            </Card> */}
    </div>
  );
};

export default NewFlowBanner;
