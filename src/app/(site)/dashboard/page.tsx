"use client";

import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Carousel from "~/app/_components/dashboard/Carousel";
import RecentProjects from "~/app/_components/dashboard/recent-projects";
import {
  isFacebookConnectedAtom,
  isInstagramConnectedAtom,
  isLinkedInConnectedAtom,
  isTwitterConnectedAtom,
  isYoutubeConnectedAtom,
} from "~/atoms";
import LoadingScreen from "~/components/loaders/loading-screen";
import NewTopBarComponent from "~/components/topbar/NewTopBarComponent";
import { trpc } from "~/trpc/react";

const Page = () => {
  const { isLoaded: isUserLoaded, user } = useUser();
  const { userMemberships, isLoaded: isMembersLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const [isTwitterConnected, setIsTwitterConnected] = useAtom(
    isTwitterConnectedAtom,
  );
  const [isLinkedInConnected, setIsLinkedInConnected] = useAtom(
    isLinkedInConnectedAtom,
  );
  const [isYoutubeConnected, setIsYoutubeConnected] = useAtom(
    isYoutubeConnectedAtom,
  );
  const [isFacebookConnected, setIsFacebookConnected] = useAtom(
    isFacebookConnectedAtom,
  );
  const [isIgGraphConnected, setIsIgGraphConnected] = useAtom(
    isInstagramConnectedAtom,
  );

  const { data: twitterData } = trpc.pathfix.fetchTwitterUserDetails.useQuery(
    { appUserId: userEmail as string },
    {
      enabled:
        !!userEmail &&
        userMemberships?.data &&
        userMemberships.data?.length > 0,
    },
  );

  const { data: linkedInData } = trpc.pathfix.fetchLinkedInUserDetails.useQuery(
    { appUserId: userEmail as string },
    {
      enabled:
        !!userEmail &&
        userMemberships?.data &&
        userMemberships.data?.length > 0,
    },
  );

  const { data: facebookData } = trpc.pathfix.fetchFacebookUserDetails.useQuery(
    { appUserId: userEmail as string },
    {
      enabled:
        !!userEmail &&
        userMemberships?.data &&
        userMemberships.data?.length > 0,
    },
  );

  const { data: youtubeData } = trpc.pathfix.fetchYoutubeUserDetails.useQuery(
    { appUserId: userEmail as string },
    {
      enabled:
        !!userEmail &&
        userMemberships?.data &&
        userMemberships.data?.length > 0,
    },
  );

  const { data: instaData } = trpc.pathfix.fetchIgGraphUserDetails.useQuery(
    { appUserId: userEmail as string },
    {
      enabled:
        !!userEmail &&
        userMemberships?.data &&
        userMemberships.data?.length > 0,
    },
  );

  console.log(
    instaData,
    twitterData,
    youtubeData,
    facebookData,
    linkedInData,
    "--------> datas",
  );

  useEffect(() => {
    if (twitterData?.rows[0]?.pincStatus === "success") {
      setIsTwitterConnected(true);
      console.log("twitter connected");
    }

    if (linkedInData?.rows[0]?.pincStatus === "success") {
      setIsLinkedInConnected(true);
      console.log("linkedin connected");
    }

    if (facebookData?.rows[0]?.pincStatus === "success") {
      setIsFacebookConnected(true);
      console.log("fb connected");
    }

    if (youtubeData?.rows[0]?.pincStatus === "success") {
      setIsYoutubeConnected(true);
      console.log("yt connected");
    }

    if (instaData?.rows[0]?.pincStatus === "success") {
      setIsIgGraphConnected(true);
      console.log("insta connected");
    }
  }, [
    twitterData,
    linkedInData,
    facebookData,
    youtubeData,
    instaData,
    setIsTwitterConnected,
    setIsLinkedInConnected,
    setIsYoutubeConnected,
    setIsFacebookConnected,
    setIsIgGraphConnected,
  ]);

  const { data: recentProjects, isLoading: isRecentProjectsLoading } =
    trpc.user.recentProjects.useQuery();

  console.log(recentProjects);

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
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Jump right back in</h1>
          <p className="text-sm text-muted-foreground">
            Here are some of your most recent projects
          </p>
          {isRecentProjectsLoading ? (
            <LoadingScreen />
          ) : (
            <RecentProjects sessions={recentProjects || []} />
          )}
        </div>
      </div>
    );
  }

  // By default, return null if not navigated yet
  return null;
};

export default Page;
