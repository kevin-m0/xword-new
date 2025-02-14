import React from "react";
import VideoVerseBanner from "./VideoVerseBanner";
import VideoVerseDocs from "./VideoVerseDocs";

const VideoVerseComponent = () => {
  return (
    <div>
      <div className="flex flex-col gap-8 p-5 px-10">
        <VideoVerseBanner />
        <VideoVerseDocs />
      </div>
    </div>
  );
};

export default VideoVerseComponent;
