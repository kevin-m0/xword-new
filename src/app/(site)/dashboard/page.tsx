"use client";

import React, { Suspense } from "react";

import { useOrganization, useUser } from "@clerk/nextjs";
import LoadingScreen from "~/components/loaders/loading-screen";

const Page = () => {
  const { isLoaded, user } = useUser();
  const { organization } = useOrganization();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (organization) {
    console.log("Current Org: ", organization);
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-5 pt-10">
        {/* <TopbarComponent /> */}
        <h1>Welcome, {user?.firstName}</h1>
      </div>
    </>
  );
};

export default Page;
