"use client";
import { Search } from "lucide-react";
import React from "react";

const SearchBarComponent = ({ handleSearch }: { handleSearch?: any }) => {
  return (
    <div className="flex w-full max-w-md items-center rounded-md border border-xw-border bg-xw-input px-2 py-3">
      <Search className="mr-4 h-4 w-4" />
      <input
        className="h-full flex-1 border-none bg-transparent p-0 text-sm outline-none focus:ring-0"
        placeholder="Search for anything"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBarComponent;
