import React from "react";
import AudioVerseBanner from "./AudioVerseBanner";
import AudioVerseDocs from "./AudioVerseDocs";

const AudioVerseComponent = () => {
  return (
    <div>
      <div className="flex flex-col gap-8 p-5 px-10">
        <AudioVerseBanner />
        <AudioVerseDocs />
      </div>
    </div>
  );
};

export default AudioVerseComponent;
