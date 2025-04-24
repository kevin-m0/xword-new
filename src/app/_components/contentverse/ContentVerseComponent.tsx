import React from "react";
import ContentVerseBanner from "./ContentVerseBanner";
import ContentVerseDocs from "./ContentVerseDocs";

const ContentVerseComponent = () => {
  return (
    <div>
      <div className="flex flex-col gap-8 p-5 px-10">
        <ContentVerseBanner />
        <ContentVerseDocs />
      </div>
    </div>
  );
};

export default ContentVerseComponent;
