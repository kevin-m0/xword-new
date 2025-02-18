"use client";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { NavigateAction, ToolbarProps } from "react-big-calendar";
import moment from "moment";
import { CalendarEvent } from "./types";

const CalendarCustomToolbar: React.FC<ToolbarProps<CalendarEvent>> = ({
  onNavigate,
  date,
  label,
}) => {
  const navigate = (action: "PREV" | "NEXT" | "TODAY" | "DATE") => {
    onNavigate(action as NavigateAction);
  };

  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex items-center gap-5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("TODAY")}
          className="px-3"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Today
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("PREV")}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">
            {moment(date).format("MMMM YYYY")}
          </span>
          <Button variant="ghost" size="icon" onClick={() => navigate("NEXT")}>
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarCustomToolbar;
