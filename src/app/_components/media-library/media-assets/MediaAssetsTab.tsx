"use client";
import { Button } from "~/components/ui/button";
import React from "react";
import {
  mediaAssetsTab,
  MEDIA_ASSETS_TAB,
  timeFilterAtom,
} from "~/atoms/mediaAtoms"; // Import atom and enum
import { useAtom } from "jotai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";

const MediaAssetsTab = () => {
  const [tab, setTab] = useAtom(mediaAssetsTab);
  const [timeFilter, setTimeFilter] = useAtom(timeFilterAtom); // Use atom for time filter

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="bg-xw-secondary flex gap-1 rounded-xl p-1">
        {/* Image Tab Button */}
        <Button
          onClick={() => setTab(MEDIA_ASSETS_TAB.image)} // Set active tab to 'image'
          variant={tab === MEDIA_ASSETS_TAB.image ? "default" : "ghost"}
          className="rounded-lg"
          size={"sm"}
        >
          Image
        </Button>
        {/* Audio Tab Button */}
        <Button
          onClick={() => setTab(MEDIA_ASSETS_TAB.audio)} // Set active tab to 'audio'
          variant={tab === MEDIA_ASSETS_TAB.audio ? "default" : "ghost"}
          className="rounded-lg"
          size={"sm"}
        >
          Audio
        </Button>
      </div>

      <div className="flex gap-2">
        {/* Time Range Filter */}
        <div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Time">All Time</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
              <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MediaAssetsTab;
