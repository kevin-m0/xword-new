import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  ChevronRight,
  Pencil,
  Scissors,
  Smile,
  CircleDot,
  Bot,
  Trash,
  X,
  Video,
  Image,
  PenTool,
} from "lucide-react";

interface SelectionMenuProps {
  top: number;
  left: number;
  onDelete: () => void;
  // onHighlight: () => void;
  onRemoveHighlight: () => void;
  startTime: number;
  endTime: number;
  selectedText: string;
  onAIBRoll: (
    startTime: number,
    endTime: number,
    selectedText: string,
    type: "video" | "image" | "AIimage",
  ) => void;
}

export function SelectionMenu({
  top,
  left,
  onDelete,
  // onHighlight,
  onRemoveHighlight,
  onAIBRoll,
  startTime,
  endTime,
  selectedText,
}: SelectionMenuProps) {
  const [showAIBRollSubmenu, setShowAIBRollSubmenu] = useState(false);

  const handleAIBRollClick = () => {
    setShowAIBRollSubmenu(true);
  };

  const handleAIBRollOptionClick = (type: "video" | "image" | "AIimage") => {
    onAIBRoll(startTime, endTime, selectedText, type);
    setShowAIBRollSubmenu(false);
  };

  return (
    <Card
      className="z-5000 absolute w-48 border-zinc-800 bg-zinc-900 px-0.5 py-1 shadow-xl"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      <div className="flex flex-col space-y-0.5">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-zinc-100 hover:bg-zinc-800 hover:text-zinc-100"
          onClick={handleAIBRollClick}
        >
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span>Add B-Roll</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {showAIBRollSubmenu && (
          <div className="ml-4 flex flex-col space-y-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-zinc-100 hover:bg-zinc-800 hover:text-zinc-100"
              onClick={() => handleAIBRollOptionClick("video")}
            >
              <div className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Stock Video</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-zinc-100 hover:bg-zinc-800 hover:text-zinc-100"
              onClick={() => handleAIBRollOptionClick("image")}
            >
              <div className="flex items-center space-x-2">
                <Image className="h-4 w-4" />
                <span>Stock Image</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-zinc-100 hover:bg-zinc-800 hover:text-zinc-100"
              onClick={() => handleAIBRollOptionClick("AIimage")}
            >
              <div className="flex items-center space-x-2">
                <PenTool className="h-4 w-4" />
                <span>AI Image</span>
              </div>
            </Button>
          </div>
        )}

        <div className="my-1 border-t border-zinc-800" />

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-red-500 hover:bg-zinc-800 hover:text-red-400"
          onClick={onRemoveHighlight}
        >
          <div className="flex items-center space-x-2">
            <X className="h-4 w-4" />
            <span>Remove B-Roll</span>
          </div>
        </Button>

        {/* <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-red-500 hover:bg-zinc-800 hover:text-red-400"
          onClick={onDelete}
        >
          <div className="flex items-center space-x-2">
            <Trash className="h-4 w-4" />
            <span>Delete & Trim Video</span>
          </div>
        </Button> */}
      </div>
    </Card>
  );
}
