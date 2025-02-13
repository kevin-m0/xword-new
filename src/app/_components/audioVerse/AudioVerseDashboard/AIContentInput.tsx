"use client";

import { FC } from "react";
import ContentPromptInput from "./ContentPromptInput";

interface AIContentInputProps {
  audioProject: any;
}

const AIContentInput: FC<AIContentInputProps> = ({ audioProject }) => {
  return (
    <div className="border-xw-border flex flex-col items-center gap-x-2 rounded-xl border px-1">
      <ContentPromptInput
        context={audioProject?.transcript || ""}
        messages={[]}
      />
    </div>
  );
};

export default AIContentInput;
