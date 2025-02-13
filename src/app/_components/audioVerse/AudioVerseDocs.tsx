"use client";

import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ChevronsUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { format } from "date-fns";

import { cn } from "~/utils/utils";
import AudioVerseUploadAudio from "./AudioVerseUploadAudio";
import EditRecordingModel from "./EditRecordingModel";
import DeleteRecordingModel from "./DeleteRecordingModel";
import { AudioProject } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { contentResponseAtom } from "~/atoms";
import { trpc } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";
import XWGradDiv from "~/components/reusable/XWGradDiv";
import XWCheckbox from "~/components/reusable/xw-checkbox";
import {
  XWDropdown,
  XWDropdownContent,
  XWDropdownItem,
  XWDropdownTrigger,
} from "~/components/reusable/xw-dropdown";
import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";

type ViewMode = "grid" | "table";

const AudioVerseDocs = () => {
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
  const [, setContentResponse] = useAtom(contentResponseAtom);

  const [recordings, setRecordings] = useState<AudioProject[]>([]);

  const { data: defaultSpace, isLoading: isWorkspaceFetching } =
    useGetActiveSpace();

  const { data: getRecordings } =
    trpc.audioProject.getAllAudioProjects.useQuery({
      id: defaultSpace?.id as string,
    });
  const router = useRouter();

  useEffect(() => {
    setContentResponse("");
    if (getRecordings !== undefined) {
      // Check for undefined
      setRecordings(getRecordings || []); // Default to empty array if getRecordings is undefined
    }
  }, [getRecordings, setContentResponse]);

  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const isAllSelected =
    recordings.length > 0 && selectedDocs.length === recordings.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(recordings.map((doc) => doc.id));
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

    // Apply date filter
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      switch (dateFilter) {
        case "newest":
          return dateB.getTime() - dateA.getTime();
        case "oldest":
          return dateA.getTime() - dateB.getTime();
        default:
          return 0;
      }
    });

    // Apply column sorting
    if (sortConfig.key && sortConfig.direction) {
      filtered = filtered.sort((a, b) => {
        const direction = sortConfig.direction === "asc" ? 1 : -1;

        switch (sortConfig.key) {
          case "name":
            return direction * a.title.localeCompare(b.title);
          case "type":
            return direction * a.type.localeCompare(b.type);
          case "created":
            return (
              direction *
              (new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime())
            );
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
        <h1 className="text-2xl font-bold">Audio Library</h1>

        <div className="flex items-center gap-2">
          <Select
            defaultValue="newest"
            value={dateFilter}
            onValueChange={setDateFilter}
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
          <AudioVerseUploadAudio />
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="tb:grid-cols-3 tb:gap-10 grid grid-cols-1 gap-5">
          {filteredAndSortedDocs.map((doc) => (
            <XWGradDiv
              key={doc.id}
              className="flex cursor-pointer gap-4 p-4"
              onClick={() => {
                router.push(`/audioverse/${doc.id}`);
              }}
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={"/images/audio-file.svg"}
                  alt="Audio file"
                  height={40}
                  width={40}
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <h3 className="text-2xl font-semibold">{doc.title}</h3>
                <div className="text-xw-muted text-sm">
                  Updated {format(new Date(doc.createdAt), "MMM dd, yyyy")}
                </div>
              </div>

              <XWDropdown>
                <XWDropdownTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </XWDropdownTrigger>
                <XWDropdownContent>
                  <XWDropdownItem
                    onClick={() => router.push(`/transcribe-audio/${doc.id}`)}
                  >
                    Open in Dashboard
                  </XWDropdownItem>
                  <EditRecordingModel />
                  <DeleteRecordingModel />
                </XWDropdownContent>
              </XWDropdown>
            </XWGradDiv>
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
                <TableHead>Media</TableHead>
                <TableHead>Creator</TableHead>
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
                        src="/images/audio-file.svg"
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
                        {doc.type}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {/* {doc.media} */}
                    Audio
                  </TableCell>
                  <TableCell>
                    {doc.createdBy}
                    {/* <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={doc.creator.image}
                        alt={doc.creator.name}
                      />
                      <AvatarFallback>{doc.creator.name[0]}</AvatarFallback>
                    </Avatar> */}
                  </TableCell>
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
                        <XWDropdownItem>Open in Dashboard</XWDropdownItem>
                        <EditRecordingModel />
                        <DeleteRecordingModel />
                      </XWDropdownContent>
                    </XWDropdown>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="h-10"></TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AudioVerseDocs;
