"use client";
import React, { useEffect } from "react";
import SocialFlowContent from "./SocialFlowContent";
import SocialFlowSidebar from "./SocialFlowSidebar";
import SocialMobileSidebar from "./SocialMobileSidebar";
import { useAtom } from "jotai";
import { postImageAtom, postTextAtom } from "~/atoms/socialAtom";
import { flowImages, flowVariations, socialFlowId } from "~/atoms/flowAtom";

const SocialFlowDesign = ({ doc, loading }: { doc: any; loading: boolean }) => {
  const [postText, setPostText] = useAtom(postTextAtom);
  const [postImage, setPostImage] = useAtom(postImageAtom);
  const [flowId, setFlowId] = useAtom(socialFlowId);
  const [images, setImages] = useAtom(flowImages);

  console.log(doc);
  setPostText(doc?.content || "");
  setPostImage(doc?.thumbnailImageUrl || "");
  setFlowId(doc?.id || "");
  setImages(doc?.images || []);

  return (
    <div className="tb:flex-row flex h-dvh flex-col overflow-hidden">
      <div className="tb:hidden flex items-center justify-between gap-2 p-3">
        <h1 className="text-2xl font-semibold">Edit</h1>
        <SocialMobileSidebar variations={doc?.variations} />
      </div>
      <div className="tb:block bg-xw-sidebar border-xw-border hidden w-full max-w-lg border-r">
        <SocialFlowSidebar variations={doc?.variations} />
      </div>
      <SocialFlowContent
        postImage={doc.thumbnailImageUrl}
        postContent={doc.content}
      />
    </div>
  );
};

export default SocialFlowDesign;
