'use client';
import React, { useState } from "react";
import SearchBarComponent from "./SearchBarComponent";
import UserBox from "./UserBox";
import NotificationBar from "./NotificationBar";

const TopBarComponent = () => {
  const [search, setSearch] = useState("");
  return (
    <div className=" p-3 px-5 tb:px-10 w-full flex items-center gap-2">
      <div className=" mr-0 ml-auto flex items-center gap-2">
        {/* <ModeToggle /> */}
        {/* <NotificationBlack /> */}
        <NotificationBar />
        <UserBox />
      </div>
    </div>
  );
};

export default TopBarComponent;
