import React from "react";
import SearchBar from "../search-bar/search-bar";
import { BellDot } from "lucide-react";

const NewTopBarComponent = () => {
  return (
    <div className="sticky flex h-20 w-full items-center justify-between rounded-t-xl p-5">
      <SearchBar />
      <div className="flex items-center gap-2">
        <BellDot className="h-5 w-5" />
      </div>
    </div>
  );
};

export default NewTopBarComponent;
