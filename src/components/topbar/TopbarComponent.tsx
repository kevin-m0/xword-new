"use client";
import React, { useState } from "react";
import SearchBarComponent from "./SearchBarComponent";
import UserBox from "./UserBox";
import NotificationBar from "./NotificationBar";

const TopbarComponent = () => {
  const [search, setSearch] = useState("");
  return (
    <div className="tb:px-10 flex w-full items-center gap-2 p-3 px-5">
      <SearchBarComponent handleSearch={setSearch} />

      <div className="ml-auto mr-0 flex items-center gap-2">
        <NotificationBar />
        <UserBox />
      </div>
    </div>
  );
};

export default TopbarComponent;
