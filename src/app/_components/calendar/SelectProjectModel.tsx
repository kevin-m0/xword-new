"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";
import {
  XWDropdown,
  XWDropdownTrigger,
  XWDropdownContent,
} from "~/components/reusable/xw-dropdown";
import { MoreHorizontal, FolderIcon } from "lucide-react";
import UploadContentModel from "./UploadContentModel";
import SearchBarComponent from "~/components/topbar/SearchBarComponent";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";
import XWGradDiv from "~/components/reusable/XWGradDiv";
import { projectDocs } from "~/lib/constant/constants";

type TimeRange =
  | "past_day"
  | "past_week"
  | "past_month"
  | "past_year"
  | "all_time";
type TypeFilter = "all" | "video" | "document";

const SelectProjectModel = ({ trigger }: { trigger?: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<"private" | "shared">("private");
  const [createdFilter, setCreatedFilter] = useState<TimeRange>("all_time");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filteredDocs = useMemo(() => {
    let filtered = [...projectDocs];

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.type === typeFilter);
    }

    // Apply created date filter
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.created);
      const dateB = new Date(b.created);

      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0;
      }

      return dateB.getTime() - dateA.getTime();
    });

    // Filter by time range for created date
    if (createdFilter !== "all_time") {
      const now = new Date();
      filtered = filtered.filter((doc) => {
        const createdDate = new Date(doc.created);
        const diffInDays =
          (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

        switch (createdFilter) {
          case "past_day":
            return diffInDays <= 1;
          case "past_week":
            return diffInDays <= 7;
          case "past_month":
            return diffInDays <= 30;
          case "past_year":
            return diffInDays <= 365;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [createdFilter, typeFilter]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant={"default"} size={"sm"}>
            Select Project <FolderIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex w-full max-w-[1200px] flex-col gap-5">
        <DialogHeader className="text-left">
          <DialogTitle className="mb-0 text-2xl font-semibold">
            Select project
          </DialogTitle>
          <DialogDescription className="mt-2">
            Select the project that contains the clip you would like to schedule
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full max-w-sm items-center bg-transparent p-0">
          <Button
            value="private"
            onClick={() => setActiveTab("private")}
            className={`w-full rounded-none border-b-2 hover:border-b-2 hover:border-xw-primary ${
              activeTab === "private"
                ? "border-xw-primary bg-gradient-to-t from-xw-primary-foreground to-transparent"
                : "border-xw-secondary"
            }`}
          >
            Private
          </Button>
          <Button
            value="shared"
            onClick={() => setActiveTab("shared")}
            className={`w-full rounded-none border-b-2 hover:border-b-2 hover:border-xw-primary ${
              activeTab === "shared"
                ? "border-xw-primary bg-gradient-to-t from-xw-primary-foreground to-transparent"
                : "border-xw-secondary"
            }`}
          >
            Shared
          </Button>
        </div>

        <XWGradSeparator />

        <div className="mb-6 flex items-center justify-between gap-5">
          <SearchBarComponent />

          <div className="flex items-center gap-4">
            <Select
              value={createdFilter}
              onValueChange={(value: TimeRange) => setCreatedFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  Created:{" "}
                  {createdFilter === "past_day"
                    ? "Past Day"
                    : createdFilter === "past_week"
                      ? "Past Week"
                      : createdFilter === "past_month"
                        ? "Past Month"
                        : createdFilter === "past_year"
                          ? "Past Year"
                          : "All Time"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="past_day">Past Day</SelectItem>
                <SelectItem value="past_week">Past Week</SelectItem>
                <SelectItem value="past_month">Past Month</SelectItem>
                <SelectItem value="past_year">Past Year</SelectItem>
                <SelectItem value="all_time">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(value: TypeFilter) => setTypeFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  {typeFilter === "all"
                    ? "All Types"
                    : typeFilter === "video"
                      ? "Video"
                      : "Document"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>

            <UploadContentModel />
          </div>
        </div>

        <div className="tb:grid-cols-4 xw-scrollbar grid max-h-[60vh] grid-cols-1 gap-5 overflow-y-auto">
          {filteredDocs.map((doc, index) => (
            <XWGradDiv
              key={index}
              className="flex cursor-pointer flex-col items-center overflow-hidden hover:opacity-80"
            >
              <div className="w-full border-b border-xw-secondary">
                <div className="relative w-full">
                  <Image
                    src={doc.image}
                    alt={doc.title}
                    width={100}
                    height={100}
                    sizes="100vh"
                    className="h-auto w-full object-cover"
                  />
                  <div className="absolute left-1 top-1">
                    <span className="rounded-sm bg-xw-sidebar px-2 py-1 text-xs text-white">
                      {doc.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center justify-between gap-2 p-5">
                <div className="flex-1">
                  <h1 className="font-semibold">{doc.title}</h1>
                  <div className="flex flex-col text-xs text-xw-muted">
                    <span>
                      Last edited:{" "}
                      {format(new Date(doc.lastEdited), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>

                <XWDropdown>
                  <XWDropdownTrigger asChild>
                    <Button size={"icon"} variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </XWDropdownTrigger>
                  <XWDropdownContent align="end">
                    <div className="flex flex-col">
                      {/* Add your dropdown actions here */}
                    </div>
                  </XWDropdownContent>
                </XWDropdown>
              </div>
            </XWGradDiv>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectProjectModel;
