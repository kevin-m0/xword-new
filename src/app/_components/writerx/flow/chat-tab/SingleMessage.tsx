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
                <div className="flex items-start gap-2 mt-2 my-2 pl-8">
                    {/* <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-2 rounded-full">
                            <User className="h-4 w-4" />
                        </div> */}
                    <div className="border border-border-primary px-2 rounded-xl w-full overflow-hidden relative">
                        <div className="inset-0 absolute z-0 bg-gray-500 bg-opacity-50"></div>
                        <p className="m-0 p-1 text-wrap break-words whitespace-normal relative z-10">
                            {msg.content}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-2 mt-2 py-2 pr-8">
                    <div
                        className="border border-gray-500 text-sm rounded-lg w-full overflow-hidden relative"
                        onDragStart={(e) => {
                            onDragStart(e, content);
                        }}
                        draggable
                    >
                        <div className="z-0 bg-black bg-opacity-50 inset-0 absolute"></div>
                        <p className="p-2 flex items-center justify-between">
                            <div className="flex gap-2 items-center">
                                Magic Chat <Bot className="h-4 w-4" />
                            </div>
                            <button>
                                <CopyToClipboardIcon
                                    onClick={() => {
                                        copyTextToClipboard(content);
                                    }}
                                    className="relative z-10"
                                />
                            </button>
                        </p>
                        <Separator
                            orientation="horizontal"
                            className="bg-[#565656] h-[1px] mt-1"
                        />

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
