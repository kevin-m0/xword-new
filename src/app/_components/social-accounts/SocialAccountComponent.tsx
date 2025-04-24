"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";
import { Card } from "~/components/ui/card";
import Script from "next/script";
import { useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import {
  isFacebookConnectedAtom,
  isInstagramConnectedAtom,
  isLinkedInConnectedAtom,
  isTwitterConnectedAtom,
  isYoutubeConnectedAtom,
} from "~/atoms";
import { trpc } from "~/trpc/react";
import InviteMembersModel from "../workspace/InviteMembersModel";
import LoadingScreen from "~/components/loaders/loading-screen";

const SocialAccountComponentRefactored = () => {
  const { user } = useUser();
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

  const userEmail = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    const script = document.getElementById("pinc.helper");
    if (script) {
      script.setAttribute("modules", "pinc.oauth.min");
      document.body.appendChild(script);
    }
  }, []);

  const { data: twitterData, isLoading: isTwitterLoading } =
    trpc.pathfix.fetchTwitterUserDetails.useQuery(
      { appUserId: userEmail as string },
      { enabled: !!userEmail },
    );

  const { data: linkedInData, isLoading: isLinkedInLoading } =
    trpc.pathfix.fetchLinkedInUserDetails.useQuery(
      { appUserId: userEmail as string },
      { enabled: !!userEmail },
    );

  const { data: facebookData, isLoading: isFacebookLoading } =
    trpc.pathfix.fetchFacebookUserDetails.useQuery(
      { appUserId: userEmail as string },
      { enabled: !!userEmail },
    );

  const { data: youtubeData, isLoading: isYoutubeLoading } =
    trpc.pathfix.fetchYoutubeUserDetails.useQuery(
      { appUserId: userEmail as string },
      { enabled: !!userEmail },
    );

  const { data: instaData, isLoading: isInstaLoading } =
    trpc.pathfix.fetchIgGraphUserDetails.useQuery(
      { appUserId: userEmail as string },
      { enabled: !!userEmail },
    );

  useEffect(() => {
    if (twitterData?.rows[0]?.pincStatus === "success")
      setIsTwitterConnected(true);
    if (linkedInData?.rows[0]?.pincStatus === "success")
      setIsLinkedInConnected(true);
    if (facebookData?.rows[0]?.pincStatus === "success")
      setIsFacebookConnected(true);
    if (youtubeData?.rows[0]?.pincStatus === "success")
      setIsYoutubeConnected(true);
    if (instaData?.rows[0]?.pincStatus === "success")
      setIsIgGraphConnected(true);
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

  const disconnectMutation = trpc.pathfix.disconnectUser.useMutation({
    onSuccess: (data) => {
      switch (data.provider) {
        case "twitteroauth2":
          setIsTwitterConnected(false);
          break;
        case "linkedin":
          setIsLinkedInConnected(false);
          break;
        case "youtube":
          setIsYoutubeConnected(false);
          break;
        case "facebook":
          setIsFacebookConnected(false);
          break;
        case "iggraphapi":
          setIsIgGraphConnected(false);
          break;
      }
    },
  });

  const socialAccounts = [
    {
      id: 1,
      name: "X (formerly Twitter)",
      icon: "/icons/twitter-new.svg",
      description: "Post directly to your X timeline",
      connectCommand: "twitteroauth2.call",
      disconnectCommand: "twitteroauth2",
      isConnected: isTwitterConnected,
    },
    {
      id: 2,
      name: "LinkedIn",
      icon: "/icons/linkedin-new.svg",
      description: "Post directly to your LinkedIn account",
      connectCommand: "linkedin.call",
      disconnectCommand: "linkedin",
      isConnected: isLinkedInConnected,
    },
    {
      id: 3,
      name: "Youtube",
      icon: "/icons/youtube-new.svg",
      description: "Post directly to your youtube account",
      connectCommand: "youtube.call",
      disconnectCommand: "youtube",
      isConnected: isYoutubeConnected,
    },
    {
      id: 4,
      name: "Instagram",
      icon: "/icons/instagram-new.svg",
      description: "Post directly to your Instagram account",
      connectCommand: "iggraphapi.call",
      disconnectCommand: "iggraphapi",
      isConnected: isIgGraphConnected,
    },
    {
      id: 5,
      name: "Facebook",
      icon: "/icons/facebook-new.svg",
      description: "Post directly to your Facebook account",
      connectCommand: "facebook.call",
      disconnectCommand: "facebook",
      isConnected: isFacebookConnected,
    },
  ];

  if (
    isTwitterLoading ||
    isLinkedInLoading ||
    isFacebookLoading ||
    isYoutubeLoading ||
    isInstaLoading
  ) {
    return <LoadingScreen />;
  }

  const disconnectUser = (provider: string) => {
    disconnectMutation.mutate({
      provider: provider,
      user_id: userEmail as string,
    });
    if (provider === "twitteroauth2") {
      setIsTwitterConnected(false);
    }
    if (provider === "linkedin") {
      setIsLinkedInConnected(false);
    }
    if (provider === "youtube") {
      setIsYoutubeConnected(false);
    }
    if (provider === "facebook") {
      setIsFacebookConnected(false);
    }
    if (provider === "iggraphapi") {
      setIsIgGraphConnected(false);
    }
  };

  return (
    <div>
      <Script
        src="https://labs.pathfix.com/helper.js"
        id="pinc.helper"
        data-user-id={userEmail}
        data-public-key={process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY}
      />
      <div className="tb:p-10 flex flex-col gap-5 p-5">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Social Accounts</h1>
          <div className="flex items-center gap-3">
            <Button variant={"secondary"} className="gap-2">
              <Image
                src={"/icons/gift.svg"}
                alt="gift"
                width={16}
                height={16}
              />
              Refer and Earn
            </Button>
            <InviteMembersModel
              trigger={
                <Button variant={"default"} size="sm">
                  Invite Members
                </Button>
              }
            />
          </div>
        </div>
        <div className="tb:gap-10 tb:grid-cols-1 grid gap-5 sm:grid-cols-1 md:grid-cols-3">
          {socialAccounts.map((account) => (
            <Card
              key={account.id}
              className="flex flex-col gap-4 rounded-lg p-5"
            >
              <Image
                src={account.icon || "/placeholder.svg"}
                alt={account.name}
                width={100}
                height={100}
                sizes="100vh"
                className="h-10 w-10"
              />
              <h3 className="mb-2 text-xl font-semibold">{account.name}</h3>
              <XWGradSeparator />
              <p className="text-sm text-xw-muted">{account.description}</p>
              <div className="mb-0 mt-auto w-full">
                {!account.isConnected ? (
                  <Button
                    variant={"secondary"}
                    size={"lg"}
                    className="w-full font-bold"
                    data-oauth-command={account.connectCommand}
                    data-client-id={process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY}
                    data-oauth-user-id={userEmail}
                    data-oauth-consent-mode="popup"
                  >
                    Connect
                  </Button>
                ) : (
                  <Button
                    variant={"secondary"}
                    size={"lg"}
                    className="w-full bg-xw-danger font-bold"
                    onClick={() => {
                      disconnectUser(account.disconnectCommand);
                    }}
                  >
                    Disconnect
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialAccountComponentRefactored;
