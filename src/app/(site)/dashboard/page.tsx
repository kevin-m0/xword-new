"use client";

import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Carousel from "~/app/_components/dashboard/Carousel";
import LoadingScreen from "~/components/loaders/loading-screen";
import NewTopBarComponent from "~/components/topbar/NewTopBarComponent";

const Page = () => {
  const { isLoaded: isUserLoaded, user } = useUser();
  const { userMemberships, isLoaded: isMembersLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const router = useRouter();

  // FOR REDIRECTING TO ONBOARDING PAGE
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(userMemberships.data?.length, "userMemberships");
      if (
        userMemberships?.data &&
        userMemberships?.isLoading === false &&
        userMemberships?.data?.length === 0
      ) {
        router.push("/getting-started");
      }
    }, 2000); // Wait for 1500ms before executing the if statements

    // Clear the timeout if the component unmounts or if the dependencies change
    return () => clearTimeout(timer);
  }, [userMemberships, router, isMembersLoaded]);

  if (!isUserLoaded || !isMembersLoaded) {
    return <LoadingScreen />;
  }

  if (userMemberships?.data?.length > 0) {
    return (
      <div className="flex flex-col p-5">
        <NewTopBarComponent />
        <div className="h-[500px] w-full gap-4 rounded-xl p-5">
          {/* <h1>Welcome, {user?.firstName}</h1> */}
          <Carousel />
        </div>
      </div>
    );
  }

  // By default, return null if not navigated yet
  return null;
};

export default Page;
