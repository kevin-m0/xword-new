"use client";
import React from "react";
import MediaProjectHeader from "./project-header/MediaProjectHeader";
import MediaProjectTab from "./MediaProjectTabs";
import { useAtom } from "jotai";
import MediaProjectAudioTable from "./media-project-audio/MediaProjectAudioTable";
import MediaProjectVideoTable from "./media-project-video/MediaProjectVideoTable";
import MediaProjectDocsTable from "./media-project-docs/MediaProjectDocsTable";
import { MEDIA_PROJECT_TAB, mediaProjectTab } from "~/atoms/mediaAtoms";

const MediaProjectComponent = () => {
  const [tab] = useAtom(mediaProjectTab);
  return (
    <div className="flex flex-col gap-8">
      <MediaProjectHeader />

      <MediaProjectTab />

      <div>
        {tab === MEDIA_PROJECT_TAB.audio ? (
          <MediaProjectAudioTable />
        ) : tab === MEDIA_PROJECT_TAB.video ? (
          <MediaProjectVideoTable />
        ) : (
          <MediaProjectDocsTable />
        )}
      </div>
    </div>
  );
};

export default MediaProjectComponent;
