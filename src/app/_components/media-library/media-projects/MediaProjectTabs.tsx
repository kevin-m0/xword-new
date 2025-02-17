"use client";
import { Button } from "~/components/ui/button";
import React, { useState } from "react";
import {
  mediaProjectTab,
  MEDIA_PROJECT_TAB,
  timeFilterAtom,
} from "~/atoms/mediaAtoms";
import { useAtom } from "jotai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";

const MediaProjectTab = () => {
  const [tab, setTab] = useAtom(mediaProjectTab); // Atom for tab state
  const [timeFilter, setTimeFilter] = useAtom(timeFilterAtom); // Use atom for time filter

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-1 rounded-xl bg-xw-card p-1">
        {/* Audio Tab Button */}
        <Button
          onClick={() => setTab(MEDIA_PROJECT_TAB.audio)} // Set active tab to 'audio'
          variant={tab === MEDIA_PROJECT_TAB.audio ? "default" : "ghost"}
          className="rounded-lg"
          size={"sm"}
        >
          Audio
        </Button>
        {/* Video Tab Button */}
        <Button
          onClick={() => setTab(MEDIA_PROJECT_TAB.video)} // Set active tab to 'video'
          // variant={tab === MEDIA_PROJECT_TAB.video ? 'xw_tab_active' : 'xw_ghost'}
          variant={tab === MEDIA_PROJECT_TAB.video ? "default" : "ghost"}
          className="rounded-lg"
          size={"sm"}
        >
          Video
        </Button>
        {/* Documents Tab Button */}
        <Button
          onClick={() => setTab(MEDIA_PROJECT_TAB.documents)} // Set active tab to 'documents'
          variant={tab === MEDIA_PROJECT_TAB.documents ? "default" : "ghost"}
          className="rounded-lg"
          size={"sm"}
        >
          Documents
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

export default MediaProjectTab;
