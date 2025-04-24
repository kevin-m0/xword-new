import React from "react";
import SearchBar from "../search-bar/search-bar";

const NewTopBarComponent = () => {
  return (
    <div className="absolute flex">
      <div className="flex items-center">
        <SearchBar />
      </div>
    </div>
  );
};

export default NewTopBarComponent;
