"use client";
import React from "react";
import DropAssetsBox from "./media-assets-audio/DropAssetsBox";
import MediaAssetsTab from "./MediaAssetsTab";
import { useAtom } from "jotai";
import MediaAssetsimageComponent from "./media-assets-image/MediaAssetsimageComponent";
import MediaAssetsAudioComponent from "./media-assets-audio/MediaAssetsAudioComponent";
import { MEDIA_ASSETS_TAB, mediaAssetsTab } from "~/atoms/mediaAtoms";

const MediaAssetsComponent = () => {
  const [tab] = useAtom(mediaAssetsTab);
  return (
    <div className="flex flex-col gap-5">
      <DropAssetsBox />
      <MediaAssetsTab />
      {tab === MEDIA_ASSETS_TAB.image ? (
        <MediaAssetsimageComponent />
      ) : (
        <MediaAssetsAudioComponent />
      )}
    </div>
  );
};

export default MediaAssetsComponent;
