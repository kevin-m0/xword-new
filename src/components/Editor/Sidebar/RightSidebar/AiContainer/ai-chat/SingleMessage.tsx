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
        <div className="my-2 mt-2 flex items-end justify-end gap-2 pl-8">
          <div className="border-border-primary relative w-2/4 overflow-hidden rounded-xl border px-2">
            <div className="absolute inset-0 z-0 bg-gray-500 bg-opacity-50"></div>
            <p className="relative z-10 m-0 whitespace-normal text-wrap break-words p-1">
              {msg.content}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-start gap-2 py-2 pr-8">
          <div className="relative w-3/5 overflow-hidden rounded-lg border border-gray-500 text-sm">
            <div className="absolute inset-0 z-0 bg-black bg-opacity-50"></div>
            <p className="relative z-10 text-wrap break-words p-4">
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
