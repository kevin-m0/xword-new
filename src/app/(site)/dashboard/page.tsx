"use client";

import React, { Suspense } from "react";

import { useUser } from "@clerk/nextjs";
import TopbarComponent from "~/components/topbar/TopbarComponent";
import TopLoader from "~/components/loaders/top-loader";
import LoadingScreen from "~/components/loaders/loading-screen";

const Page = () => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-5 pt-10">
        {/* <TopbarComponent /> */}
        <h1>Welcome, {user?.firstName}</h1>
        {/* <div className="max-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
      </div>
    </>
  );
};

export default Page;
