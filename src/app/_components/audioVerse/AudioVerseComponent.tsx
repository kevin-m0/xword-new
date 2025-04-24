import React from "react";
import AudioVerseBanner from "./AudioVerseBanner";
import AudioVerseDocs from "./AudioVerseDocs";
import NewTopBarComponent from "~/components/topbar/NewTopBarComponent";

const AudioVerseComponent = () => {
  return (
    <div>
      <div className="flex flex-col gap-8 px-5">
        <AudioVerseBanner />
        <AudioVerseDocs />
      </div>
    </div>
  );
};

export default AudioVerseComponent;
