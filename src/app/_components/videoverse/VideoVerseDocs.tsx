"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { videoDocs as docs } from "~/lib/constant/videoverse.constants";
import XWGradDiv from "~/components/reusable/XWGradDiv";
import { Button } from "~/components/ui/button";
import { ChevronsUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";
import XWCheckbox from "~/components/reusable/xw-checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { format } from "date-fns";
import {
  XWDropdown,
  XWDropdownContent,
  XWDropdownItem,
  XWDropdownTrigger,
} from "~/components/reusable/xw-dropdown";
import { cn } from "~/utils/utils";
import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import { useRouter } from "next/navigation";
import { VideoModel } from "@prisma/client";
import { VideoVerseUploadModal } from "./VideoVerseUploadModal";
import { trpc } from "~/trpc/react";

type ViewMode = "grid" | "table";

const VideoVerseDocs = () => {
  const [recordings, setRecordings] = useState<VideoModel[]>([]);

  const { data: defaultSpace, isLoading: isWorkspaceFetching } =
    useGetActiveSpace();

  const { data: getRecordings, isLoading: isLoadingRecordings } =
    trpc.videoProject.getAllVideoProjects.useQuery(
      {
        id: defaultSpace?.id as string,
      },
      {
        enabled: !!defaultSpace?.id,
      },
    );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (getRecordings !== undefined) {
      // Check for undefined
      setRecordings(getRecordings || []);
    }
  }, [getRecordings]);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState("newest");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });

  console.log(defaultSpace?.id, "active workspace");

  const isAllSelected = docs.length > 0 && selectedDocs.length === docs.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(docs.map((doc) => doc.id));
    }
  };

  const toggleDoc = (docId: string) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter((id) => id !== docId));
    } else {
      setSelectedDocs([...selectedDocs, docId]);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        if (prevConfig.direction === "asc") {
          return { key, direction: "desc" };
        }
        return { key: "", direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  const filterAndSortDocs = () => {
    let filtered = [...recordings];

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0;
      }

      switch (dateFilter) {
        case "newest":
          return dateB.getTime() - dateA.getTime();
        case "oldest":
          return dateA.getTime() - dateB.getTime();
        case "modified":
          return dateB.getTime() - dateA.getTime();
        default:
          return 0;
      }
    });

    if (sortConfig.key && sortConfig.direction) {
      filtered = filtered.sort((a, b) => {
        const direction = sortConfig.direction === "asc" ? 1 : -1;

        switch (sortConfig.key) {
          case "name":
            return direction * a.title.localeCompare(b.title);
          case "created":
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return direction * (dateA - dateB);
          case "creator":
            return direction * a.createdBy.localeCompare(b.createdBy);
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return (
      <ChevronsUpDown
        className={cn("h-4 w-4", sortConfig.direction && "text-primary")}
      />
    );
  };

  const filteredAndSortedDocs = filterAndSortDocs();

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recent Videos</h1>

        <div className="flex items-center gap-2">
          <Select
            defaultValue="newest"
            value={dateFilter}
            onValueChange={(value) => {
              setDateFilter(value);
              setSortConfig({ key: "", direction: null });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                {dateFilter === "newest"
                  ? "Newest first"
                  : dateFilter === "oldest"
                    ? "Oldest first"
                    : "Last modified"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="modified">Last modified</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={"ghost"}
            size={"icon"}
            className={cn(
              "text-xw-primary",
              viewMode !== "grid" && "text-white",
            )}
            onClick={() => setViewMode("grid")}
          >
            <Image
              src={
                viewMode === "grid"
                  ? "/icons/grid-active.svg"
                  : "/icons/grid.svg"
              }
              height={20}
              width={20}
              alt="grid"
            />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            className={cn(
              "text-xw-primary",
              viewMode !== "table" && "text-white",
            )}
            onClick={() => setViewMode("table")}
          >
            <Image
              src={
                viewMode === "table"
                  ? "/icons/list-active.svg"
                  : "/icons/list.svg"
              }
              height={20}
              width={20}
              alt="list"
            />
          </Button>

          {/* <CloudinaryUpload /> */}

          <Button onClick={() => setIsModalOpen(true)} variant="default">
            New Video Project
          </Button>
          <VideoVerseUploadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="tb:grid-cols-3 tb:gap-10 grid grid-cols-1 gap-5">
          {filteredAndSortedDocs.map((doc, index) => (
            <Link key={index} href={`/videoverse/${doc.id}`}>
              <XWGradDiv className="flex flex-col items-center overflow-hidden">
                <div className="flex w-full items-center justify-between gap-2 p-5">
                  <div className="flex-1">
                    <h1>{doc.title}</h1>
                    <p className="text-xw-muted text-sm">
                      {format(new Date(doc.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="border-xw-secondary w-full border-t">
                  <div className="relative h-[200px] w-full">
                    <Image
                      src={`${doc.thumbnailUrl}`}
                      alt={doc.title}
                      width={20}
                      height={20}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-1 top-1">
                      <span className="bg-xw-sidebar rounded-sm px-2 py-1 text-xs text-white">
                        {`${doc.duration} mins`}
                      </span>
                    </div>
                  </div>
                </div>
              </XWGradDiv>
            </Link>
          ))}
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader className="bg-xw-background">
              <TableRow>
                <TableHead className="w-12">
                  <XWCheckbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="flex w-full items-center justify-between hover:bg-transparent"
                  >
                    Name
                    {getSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("creator")}
                    className="flex w-full items-center justify-between hover:bg-transparent"
                  >
                    Creator
                    {getSortIcon("creator")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("created")}
                    className="flex w-full items-center justify-between hover:bg-transparent"
                  >
                    Created
                    {getSortIcon("created")}
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDocs.map((doc) => (
                <TableRow
                  key={doc.id}
                  className={cn(
                    "bg-xw-sidebar border-xw-secondary border-b transition-colors",
                    selectedDocs.includes(doc.id) &&
                      "bg-xw-primary-foreground ring-xw-primary border-xw-primary border ring-1 hover:bg-purple-500/20",
                  )}
                >
                  <TableCell>
                    <XWCheckbox
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={() => toggleDoc(doc.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/video-file.svg"
                        alt="file"
                        width={16}
                        height={16}
                      />
                      {doc.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-fit rounded-md bg-gradient-to-r from-white/10 via-white/30 to-white/40 p-[0.5px]">
                      <div className="bg-xw-sidebar rounded-md px-2 py-1 text-xs">
                        Video
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.videoType}
                  </TableCell>
                  <TableCell>{doc.createdBy}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(doc.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <XWDropdown>
                      <XWDropdownTrigger asChild>
                        <Button variant={"ghost"} size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </XWDropdownTrigger>
                      <XWDropdownContent align="end">
                        <XWDropdownItem>Rename</XWDropdownItem>
                        <XWDropdownItem>Download</XWDropdownItem>
                        <XWDropdownItem>Share</XWDropdownItem>
                        <XWDropdownItem>Move</XWDropdownItem>
                        <XWDropdownItem className="text-red-500">
                          Delete
                        </XWDropdownItem>
                      </XWDropdownContent>
                    </XWDropdown>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="h-10" />
            </TableBody>
          </Table>
        </div>
      )}
      {filteredAndSortedDocs.length === 0 && (
        <>no videos. upload one and then come back.</>
      )}
    </div>
  );
};

export default VideoVerseDocs;
