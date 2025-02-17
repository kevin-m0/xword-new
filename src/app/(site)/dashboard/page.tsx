"use client";

import React from "react";

import { useUser } from "@clerk/nextjs";

const Page = () => {
  const { isLoaded, user } = useUser();

  if (isLoaded) {
    console.log(user);
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4 pt-0">
        {/* <div className="max-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
      </div>
    </>
  );
};

export default Page;
