'use client';
import { Search } from "lucide-react";
import React from "react";

const SearchBarComponent = ({ handleSearch }: { handleSearch?: any }) => {
  return (
    <div className="max-w-md rounded-md w-full bg-xw-input border border-xw-border flex items-center px-2 py-3">
      <Search className="h-4 w-4 mr-4" />
      <input
        className="p-0 h-full text-sm flex-1 bg-transparent outline-none border-none focus:ring-0"
        placeholder="Search for anything"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBarComponent;
