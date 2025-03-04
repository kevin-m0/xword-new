import React from "react";
import SearchBar from "../search-bar/search-bar";
import { SidebarTrigger } from "../ui/sidebar";

const NewTopBarComponent = () => {
  return (
    <div className="sticky flex h-12 w-full items-center">
      <div className="flex items-center">
        {/* <SidebarTrigger /> */}
        <SearchBar />
      </div>
    </div>
  );
};

export default NewTopBarComponent;
