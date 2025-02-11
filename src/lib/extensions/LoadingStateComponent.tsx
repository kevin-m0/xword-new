import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import LoaderCircle from "~/icons/LoaderCircle";
const LoadingStateComponent = () => {
  return (
    <NodeViewWrapper>
      <div className="inline-flex items-center">
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-[#3F3F46]" />
        <span className="text-[#3F3F46]">Loading....</span>
      </div>
    </NodeViewWrapper>
  );
};

export default LoadingStateComponent;
