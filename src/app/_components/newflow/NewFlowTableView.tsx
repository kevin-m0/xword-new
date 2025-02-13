import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import XWCheckbox from "../reusable/xw-checkbox";
import {
  XWDropdown,
  XWDropdownContent,
  XWDropdownItem,
  XWDropdownTrigger,
} from "../reusable/xw-dropdown";
import { Button } from "~/components/ui/button";
import { FaEllipsis } from "react-icons/fa6";

const NewFlowTableView = () => {
  // Sample data
  const [data, setData] = useState([
    { id: 1, title: "Document 1", created: "2025-01-15", isSelected: false },
    { id: 2, title: "Document 2", created: "2025-01-14", isSelected: false },
    { id: 3, title: "Document 3", created: "2025-01-13", isSelected: false },
  ]);

  const [selectAll, setSelectAll] = useState(false);

  const toggleRowSelection = (id: number) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, isSelected: !row.isSelected } : row,
      ),
    );
  };

  const toggleSelectAll = () => {
    setSelectAll((prev) => !prev);
    setData((prevData) =>
      prevData.map((row) => ({ ...row, isSelected: !selectAll })),
    );
  };

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <XWCheckbox
                checked={selectAll}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <XWCheckbox
                  checked={row.isSelected}
                  onCheckedChange={() => toggleRowSelection(row.id)}
                />
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.created}</TableCell>
              <TableCell>
                <XWDropdown>
                  <XWDropdownTrigger asChild>
                    <Button variant={"xw_ghost"} size={"icon"}>
                      <FaEllipsis className="h-4 w-4" />
                    </Button>
                  </XWDropdownTrigger>
                  <XWDropdownContent>
                    <XWDropdownItem>View</XWDropdownItem>
                    <XWDropdownItem>Delete</XWDropdownItem>
                  </XWDropdownContent>
                </XWDropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NewFlowTableView;
