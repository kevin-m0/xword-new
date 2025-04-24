import React, { useEffect, useState } from "react";
import { Separator } from "~/components/ui/separator";
import { Bot } from "lucide-react";
import { CopyToClipboardIcon } from "~/icons";
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
    const onDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        content: string,
    ) => {
        event.dataTransfer?.setData("text/plain", content);
    };

  return (
    <>
      {msg.role === "user" ? (
        <div className="my-2 mt-2 flex items-end justify-end gap-2">
          {/* <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-2 rounded-full">
            <User className="h-4 w-4" />
          </div> */}
          <div className="border-border-primary relative overflow-hidden rounded-xl border px-2">
            <div className="absolute inset-0 z-0 bg-gray-500 bg-opacity-50"></div>
            <p className="relative z-10 m-0 whitespace-normal text-wrap break-words p-1">
              {msg.content}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex w-3/4 flex-col justify-start gap-2 py-2">
          <div className="relative w-full overflow-hidden rounded-lg border border-gray-500 text-sm">
            <div className="absolute inset-0 z-0 bg-black bg-opacity-50"></div>
            <p className="flex items-center justify-between p-2"></p>
            <p className="relative z-10 text-wrap break-words p-4">
              {content.length > 4000
                ? content.substring(0, 2000) + "...."
                : content}
            </p>
          </div>
          <button>
            <CopyToClipboardIcon
              onClick={() => {
                copyTextToClipboard(content);
              }}
              className="relative z-10"
            />
          </button>
        </div>
      )}
    </>
  );
};

export default SingleMessage;
