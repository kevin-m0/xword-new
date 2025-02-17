"use client";
import React from "react";
import MediaHeader from "./MediaHeader";
import MediaTabs from "./MediaTabs";
import MediaAssetsComponent from "./media-assets/MediaAssetsComponent";
import { useAtom } from "jotai";
import MediaProjectComponent from "./media-projects/MediaProjectComponent";
import { mediaTabs } from "~/atoms/mediaAtoms";

const MediaComponent = () => {
  const [tab] = useAtom(mediaTabs);
  return (
    <div className="flex h-full w-full flex-col gap-8">
      <div className="tb:px-10 flex flex-col gap-5 px-5 py-10">
        <MediaHeader />
        <MediaTabs />

        {tab === "assets" ? (
          <MediaAssetsComponent />
        ) : (
          <MediaProjectComponent />
        )}
      </div>
    </div>
  );
};

export default MediaComponent;
