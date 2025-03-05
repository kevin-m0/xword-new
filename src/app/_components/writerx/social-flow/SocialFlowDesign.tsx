"use client";
import React, { useEffect } from "react";
import SocialFlowContent from "./SocialFlowContent";
import SocialFlowSidebar from "./SocialFlowSidebar";
import SocialMobileSidebar from "./SocialMobileSidebar";
import { useAtom } from "jotai";
import { postImageAtom, postTextAtom } from "~/atoms/socialAtom";
import { flowImages, flowVariations, socialFlowId } from "~/atoms/flowAtom";
import { trpc } from "~/trpc/react";
import { Loader2 } from "lucide-react";

const SocialFlowDesign = ({ orgId, docId }: { orgId: string; docId: string }) => {
  const [postText, setPostText] = useAtom(postTextAtom);
  const [postImage, setPostImage] = useAtom(postImageAtom);
  const [flowId, setFlowId] = useAtom(socialFlowId);
  const [images, setImages] = useAtom(flowImages);
  
  const { data: doc, isLoading } = trpc.writerx.fetchSocialDocument.useQuery(
    { id: docId, spaceId: orgId },
    { enabled: !!orgId }
  );
  useEffect(() => {
    setFlowId(docId);
  }, [])
  
  
  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        {/* <p className="text-lg font-semibold">Loading...</p> */}
        <Loader2 size={64} className="animate-spin" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-lg font-semibold text-red-500">Failed to load document.</p>
      </div>
    );
  }

  return (
    <div className="tb:flex-row flex h-[100vh] flex-col overflow-scroll">
      <div className="tb:hidden flex items-center justify-between gap-2 p-3">
        <h1 className="text-2xl font-semibold">Edit</h1>
        <SocialMobileSidebar variations={doc.variations} />
      </div>
      <div className="tb:block bg-xw-sidebar border-xw-border hidden w-full max-w-lg border-r">
        <SocialFlowSidebar variations={doc.variations} />
      </div>
      <SocialFlowContent postImage={doc?.thumbnailImageUrl as string} postContent={doc?.content as string} />
    </div>
  );
};

export default SocialFlowDesign;
