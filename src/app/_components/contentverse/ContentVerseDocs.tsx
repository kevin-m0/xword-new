"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { docs } from "~/lib/constant/constants";
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
import { Avatar } from "~/components/ui/avatar";

import { cn } from "~/utils/utils";
import { useRouter } from "next/navigation";
import { Document } from "@prisma/client";
import { trpc } from "~/trpc/react";
import {
  XWDropdown,
  XWDropdownContent,
  XWDropdownItem,
  XWDropdownTrigger,
} from "~/components/reusable/xw-dropdown";
import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";

type ViewMode = "grid" | "table";

const ContentVerseDocs = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const { data: defaultSpace, isLoading: isWorkspaceFetching } =
    useGetActiveSpace();

  const { data: getDocuments, isLoading: isLoadingDocuments } =
    trpc.document.getAllDocuments.useQuery();

  const { mutateAsync: deleteDoc } = trpc.document.deleteDoc.useMutation();

  const router = useRouter();

  useEffect(() => {
    setDocuments(getDocuments || []);
  }, [getDocuments]);

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

  const isAllSelected =
    documents.length > 0 && selectedDocs.length === docs.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map((doc) => doc.id));
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
    let filtered = [...documents];

    // Apply date filter
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      // Ensure valid date comparison
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0;
      }

      switch (dateFilter) {
        case "newest":
          return dateB.getTime() - dateA.getTime();
        case "oldest":
          return dateA.getTime() - dateB.getTime();
        case "modified":
          // For now using created date as modified date
          return dateB.getTime() - dateA.getTime();
        default:
          return 0;
      }
    });

    // Then apply column sorting if active
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
        <h1 className="text-2xl font-bold">Recent Documents</h1>

        <div className="flex items-center gap-2">
          <Select
            defaultValue="newest"
            value={dateFilter}
            onValueChange={(value) => {
              setDateFilter(value);
              // Reset column sorting when changing date filter
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
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="tb:grid-cols-3 tb:gap-10 grid grid-cols-1 gap-5">
          {filteredAndSortedDocs.map((doc, index) => (
            <Link key={index} href={`/writerx/${doc.id}`}>
              <XWGradDiv className="flex flex-col items-center gap-5 overflow-hidden">
                <div className="flex w-full items-center justify-between gap-2 p-5">
                  <div className="flex-1">
                    <h1>{doc.title}</h1>
                    <p className="text-xw-muted text-sm">{doc.createdBy}</p>
                  </div>
                </div>

                <div className="border-xw-secondary tb:px-14 flex w-full items-center justify-center border-t px-10">
                  <div className="h-[200px] w-[200px] flex-1">
                    <Image
                      src={(doc.thumbnailImageUrl as string) || ""}
                      alt={doc.title}
                      sizes="100vh"
                      height={100}
                      width={100}
                      className="h-full w-full object-cover object-left-top"
                    />
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
                <TableHead>Media</TableHead>
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
                        src="/images/image-file.svg"
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
                        Upload
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.isStarred ? "Starred" : "Unstarred"}
                  </TableCell>
                  <TableCell>
                    <Avatar className="h-8 w-8">{doc.createdBy}</Avatar>
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
                        <XWDropdownItem
                          onClick={() => {
                            router.push("/contentverse/" + doc.id);
                          }}
                        >
                          Open in WriterX
                        </XWDropdownItem>
                        <XWDropdownItem>Download</XWDropdownItem>
                        <XWDropdownItem
                          className="text-red-500"
                          onClick={() => {
                            deleteDoc({ docId: doc.id });
                          }}
                        >
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
    </div>
  );
};

export default ContentVerseDocs;
