import React from "react";

import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import FlowDialog from "./flow/FlowDialog";
import MultiCampaignDynamicDialog from "./multi-campaign/MultiCampaignDynamicDialog";

const WriterXBannerComponent = () => {
    return (
        <div className="py-5 relative">
            <div
                className="p-[1px] rounded-2xl relative"
                style={{
                    backgroundImage: `url("/banners/writerx-banner.png")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="rounded-2xl min-h-[400px] h-full w-full flex flex-col justify-center items-center p-8 bg-black/40">
                    <div className="flex flex-col gap-6 text-center max-w-4xl mx-auto">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl font-medium text-white capitalize leading-tight">
                                Amplify your writing power
                            </h1>
                            <p className=" max-w-3xl text-xw-muted-foreground mt-4">
                                From seamless collaboration to AI-enhanced creation,
                            </p>
                            <p className=" max-w-3xl text-xw-muted-foreground">
                                WriterX redefines how you write, refine, and manage content.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-4 justify-center">
                            <FlowDialog>
                                <Button variant={"default"} size={"lg"}>
                                    Create <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </FlowDialog>
                            <MultiCampaignDynamicDialog source="url">
                                <Button variant="secondary">
                                    Create Multiple
                                </Button>
                            </MultiCampaignDynamicDialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WriterXBannerComponent;
