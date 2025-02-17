import React, { useEffect, useState } from "react";
import { Messages } from "~/types";

interface SingleMessageProps {
  dropToKeyboard: (contents: string) => void;
  msg: Messages;
}

const SingleMessage: React.FC<SingleMessageProps> = ({
  dropToKeyboard,
  msg,
}) => {
  useEffect(() => {
    setContent(msg.content);
  }, [msg]);

  const [content, setContent] = useState("");
  const copyTextToClipboard = (contents: string) => {
    navigator.clipboard.writeText(contents);
  };

  return (
    <>
      {msg.role === "user" ? (
        <div className="flex items-end justify-end gap-2 mt-2 my-2 pl-8">
          <div className="border border-border-primary px-2 rounded-xl w-2/4 overflow-hidden relative">
            <div className="inset-0 absolute z-0 bg-gray-500 bg-opacity-50"></div>
            <p className="m-0 p-1 text-wrap break-words whitespace-normal relative z-10">
              {msg.content}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 mt-2 py-2 pr-8">
          <div className="border border-gray-500 text-sm rounded-lg w-3/5 overflow-hidden relative">
            <div className="z-0 bg-black bg-opacity-50 inset-0 absolute"></div>
            <p className="p-4 text-wrap relative z-10 break-words">
              {content.length > 4000
                ? content.substring(0, 2000) + "...."
                : content}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleMessage;
