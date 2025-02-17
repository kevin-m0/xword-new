"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { ChevronsDownUp, ChevronsUpDown, MoreHorizontal } from "lucide-react";
import {
  XWDropdown,
  XWDropdownContent,
  XWDropdownItem,
  XWDropdownTrigger,
} from "~/components/reusable/xw-dropdown";
import moment from "moment";
import MediaProjectDeleteModel from "../MediaProjectDeleteModel";
import Link from "next/link";
import { MediaProjectVideoDocs } from "~/types/media.types";

const DataTableColumnHeader = ({
  column,
  title,
}: {
  column: any;
  title: string;
}) => (
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

export const columns: ColumnDef<MediaProjectVideoDocs>[] = [
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
    accessorKey: "text",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),

    cell: ({ row }) => (
      <div>
        {row.original.title.slice(0, 50) +
          (row.original.title.length > 50 ? "..." : "")}
      </div>
    ),
  },
  {
    accessorKey: "videoType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div>{row.original.videoType}</div>,
  },
  {
    accessorKey: "mediaType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Media" />
    ),
    cell: ({ row }) => <div>Video</div>,
  },
  // {
  //     accessorKey: "User",
  //     header: ({ column }) => (
  //         <DataTableColumnHeader column={column} title="Creator" />
  //     ),
  //     cell: ({ row }) => {
  //         const user = row.original.User;
  //         return (
  //             <div className="flex items-center gap-2">
  //                 <Avatar className="h-8 w-8">
  //                     <AvatarImage
  //                         src={user.image}
  //                         alt={user.name}
  //                     />
  //                     <AvatarFallback>
  //                         {user.name.slice(0, 2)}
  //                     </AvatarFallback>
  //                 </Avatar>
  //             </div>
  //         );
  //     },
  // },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => moment(row.getValue("createdAt")).fromNow(),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <XWDropdown>
        <XWDropdownTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </XWDropdownTrigger>
        <XWDropdownContent align="end">
          <MediaProjectDeleteModel id={row.original.id} type="video" />
          <Link href={`/videoverse/${row.original.id}`}>
            <XWDropdownItem>View</XWDropdownItem>
          </Link>
        </XWDropdownContent>
      </XWDropdown>
    ),
  },
];
