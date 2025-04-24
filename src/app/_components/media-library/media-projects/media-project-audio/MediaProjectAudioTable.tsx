"use client";

import { useMemo, useState } from "react";
import {
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { columns } from "./MediaProjectAudioColumn";
import { Button } from "~/components/ui/button";
import { useAtom } from "jotai";
import { useXWAlert, XWAlert } from "~/components/reusable/xw-alert";
import { timeFilterAtom } from "~/atoms/mediaAtoms";
import { trpc } from "~/trpc/react";
// import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import { MediaProjectAudioDocs } from "~/types/media.types";
import TableLoader from "~/components/loaders/TableLoader";
// import EmptyScreen from "~/components/reusable/EmptyScreen";
import OnTableSelectActions from "~/components/reusable/OnTableSelectActions";
import { useOrganization } from "@clerk/nextjs";

export default function MediaProjectAudioTable() {
  const { organization : defaultSpace} = useOrganization();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { showToast } = useXWAlert();
  const utils = trpc.useUtils();
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [timeFilter] = useAtom(timeFilterAtom);



  const {
    data: assets,
    isLoading,
    isError,
  } = trpc.assets.getProjectAudioDocs.useQuery({
    workspaceId: defaultSpace?.id as string,
  });

  const filteredAssets = useMemo(() => {
    if (!assets) return [];

    const now = new Date();

    return assets.filter((audio: MediaProjectAudioDocs) => {
      const createdAt = new Date(audio.createdAt); // Ensure 'createdAt' exists in your data

      switch (timeFilter) {
        case "Today":
          return createdAt.toDateString() === now.toDateString();
        case "Last 7 Days":
          return now.getTime() - createdAt.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case "Last 30 Days":
          return (
            now.getTime() - createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000
          );
        default: // "All Time"
          return true;
      }
    });
  }, [assets, timeFilter]);

  const table = useReactTable({
    data: filteredAssets as MediaProjectAudioDocs[],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRowIds = Object.keys(rowSelection)
    .filter((id) => rowSelection[id])
    .map(
      (id) =>
        table.getRowModel().rows.find((row) => row.id === id)?.original.id,
    )
    .filter((id): id is string => id !== undefined);

  const deleteAudio = trpc.assets.deleteMultipleProjectDocuments.useMutation({
    onSuccess: () => {
      // Invalidate query to fetch the updated data
      utils.assets.getProjectAudioDocs.invalidate();

      // Clear rowSelection after mutation
      setRowSelection({});

      // Explicitly reset table's internal state
      table.resetRowSelection();

      // Show success toast
      showToast({
        title: "Deleted!",
        message: "Asset(s) deleted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      console.error("Error deleting asset:", error.message);
      showToast({
        title: "Error",
        message: error.message,
        variant: "error",
      });
    },
  });

  const handleDeleteSelected = () => {
    if (selectedRowIds && selectedRowIds.length > 0) {
      console.log(selectedRowIds);

      // Perform the mutation
      deleteAudio.mutate({
        documentIds: selectedRowIds, // Pass selectedRowIds here
        type: "audio", // Ensure the correct type is sent
      });
    }
  };

  return (
    <div className="w-full">
      {!isLoading && !isError && (assets?.length as number) > 0 && (
        <div>
          <div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="bg-xw-sidebar">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="h-4" />
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="hover:bg-secondary"
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="hover:bg-secondary"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {isError && (
        <XWAlert
          variant="error"
          title="Error"
          message="Something went wrong. Please try again later."
        />
      )}

      {isLoading && <TableLoader />}

      {/* {filteredAssets && !isLoading && filteredAssets.length === 0 && (
        <EmptyScreen
          title="No Audio Found"
          description="No audio found. Please create an audio project to view."
        />
      )} */}

      <OnTableSelectActions
        selectedCount={selectedRowIds.length}
        selectedTypes={{ Audio: selectedRowIds.length }} // Assuming all selected items are images
        onClose={() => setRowSelection({})} // Close or reset selection when actions are closed
        dropdownActions={
          <Button
            variant="ghost"
            size={"sm"}
            className="w-full justify-start"
            onClick={handleDeleteSelected}
          >
            Delete
          </Button>
        }
      />
    </div>
  );
}
