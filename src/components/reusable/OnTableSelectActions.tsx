"use client";

import { Button } from "~/components/ui/button";
import { ChevronsUpDown, X } from "lucide-react";
import {
  XWDropdown,
  XWDropdownContent,
  XWDropdownTrigger,
} from "./xw-dropdown";
import { Separator } from "~/components/ui/separator";
import React from "react";

interface OnTableSelectActionsProps {
  selectedCount: number;
  selectedTypes: { [key: string]: number };
  onClose: () => void;
  dropdownActions: React.ReactNode;
}

const OnTableSelectActions = ({
  selectedCount,
  selectedTypes,
  onClose,
  dropdownActions,
}: OnTableSelectActionsProps) => {
  if (selectedCount === 0) return null;

  const getSelectionText = () => {
    return Object.entries(selectedTypes)
      .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
      .join(", ");
  };

  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform">
      <div className="bg-xw-primary flex items-center gap-6 rounded-full px-6 py-3 shadow-lg">
        <span className="text-sm font-medium">{getSelectionText()}</span>
        <Separator orientation="vertical" className="h-4 bg-white" />
        <div className="flex items-center gap-3">
          <XWDropdown>
            <XWDropdownTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 text-sm hover:bg-purple-400/30"
              >
                Actions <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </XWDropdownTrigger>
            <XWDropdownContent align="end" className="mt-2">
              {dropdownActions}
            </XWDropdownContent>
          </XWDropdown>
        </div>
        <Separator orientation="vertical" className="h-4 bg-white" />
        <Button
          variant="ghost"
          size="icon"
          className="gap-2 text-sm hover:bg-purple-400/30"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OnTableSelectActions;
