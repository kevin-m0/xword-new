import React from "react";
import SearchBar from "../search-bar/search-bar";

const NewTopBarComponent = () => {
  return (
    <div className="sticky h-20 w-full rounded-t-xl p-5">
      <SearchBar />
    </div>
  );
};

export default NewTopBarComponent;
