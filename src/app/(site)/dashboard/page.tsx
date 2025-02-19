"use client";

import React, { useEffect, useState } from "react";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import LoadingScreen from "~/components/loaders/loading-screen";
import { useRouter } from "next/navigation";
import { isFirstTimeUser } from "~/app/api/actions/isFirstTimeUser";
import NewTopBarComponent from "~/components/topbar/NewTopBarComponent";

const Page = () => {
  const { isLoaded, user } = useUser();
  const { userMemberships, isLoaded: isMembersLoaded } = useOrganizationList({
    userMemberships: {
      pageSize: 5,
    },
  });

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (userMemberships?.data?.length) {
    return (
      <div>
        <NewTopBarComponent />
        <div className="flex flex-1 flex-col gap-4 rounded-xl p-5">
          <h1>Welcome, {user?.firstName}</h1>
        </div>
      </div>
    );
  }

  return null;
};

export default Page;
