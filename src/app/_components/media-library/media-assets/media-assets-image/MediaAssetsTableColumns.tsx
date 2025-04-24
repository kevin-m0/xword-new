"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "~/components/ui/checkbox";
import { ChevronsDownUp, ChevronsUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";

import moment from "moment";
import Image from "next/image";
import MediaAssetsDeleteConfirmationModel from "../MediaAssetsDeleteConfirmationModel";
import { useEffect, useState } from "react";
import MediaAssetImagePreview from "./MediaAssetsImagePreview";
import { getAwsUrl } from "~/lib/get-aws-url";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  XWDropdown,
  XWDropdownContent,
  XWDropdownTrigger,
} from "~/components/reusable/xw-dropdown";
import { MediaAssetImage } from "~/types/media.types";

interface OnTableSelectActionsProps {
  selectedCount: number;
  selectedTypes: { [key: string]: number };
  selectedIds: string[]; // Added to track selected IDs
  onClose: () => void;
}

const DisplayImageData = ({ image }: { image: string }) => {
  return (
    <div className="flex items-center gap-2">
      {
        <Image
          src={getAwsUrl(image) as string}
          width={100}
          height={100}
          alt={getAwsUrl(image) as string}
          sizes="100vh"
          className="h-10 w-10 rounded-md object-contain"
        />
      }
      {/* <div>
                <h1>{imageName || "Unnamed Image"}</h1>
                <p>{imageSize ? `Size: ${(imageSize / 1024).toFixed(2)} KB` : "Size not available"}</p>
            </div> */}
    </div>
  );
};

const DataTableColumnHeader = ({
  column,
  title,
}: {
  column: any;
  title: string;
}) => {
  return (
    <button
      className="flex w-full items-center justify-between"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <span className="ml-2">
        {column.getIsSorted() === "asc" ? (
          <ChevronsDownUp className="h-4 w-4" />
        ) : (
          <ChevronsUpDown className="h-4 w-4" />
        )}
      </span>
    </button>
  );
};
const imageKeyFormatter = (imageKey: string) =>
  imageKey.replace(/^images\//, "").replace(/\.png$/, "");

export const columns: ColumnDef<MediaAssetImage>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const imageKey = row.original.imageKey as string;

      return (
        <div className="flex items-center gap-2">
          <DisplayImageData image={imageKey} />
        </div>
      );
    },
  },
  {
    accessorKey: "generationType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title=" Type" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("generationType") === "TEXT_TO_IMAGE"
          ? "Generated"
          : "Uploaded"}
      </div>
    ),
  },
  {
    accessorKey: "mediaType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Media" />
    ),
    cell: ({ row }) => {
      // const imageKey = row.getValue("imageKey") as string;
      // if (imageKey) {
      //     return "Image";
      // }
      return "Image";
    },
  },

  {
    accessorKey: "Creator",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creator" />
    ),
    cell: ({ row }) => {
      const userImage = row.original.User.image as string;
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={userImage} alt="User avatar" />
          <AvatarFallback>{row.original.User.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => moment(row.getValue("createdAt")).fromNow(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <XWDropdown>
          <XWDropdownTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </XWDropdownTrigger>
          <XWDropdownContent align="end">
            <MediaAssetsDeleteConfirmationModel
              type="image"
              id={row.original.id}
            />
            <MediaAssetImagePreview
              imageKey={
                row.original.imageKey
                  .replace(/^images\//, "")
                  .replace(/\.png$/, "") as string
              }
            />
          </XWDropdownContent>
        </XWDropdown>
      );
    },
  },
];
