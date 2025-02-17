"use client";

import { useAtom } from "jotai";

import { FC, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { recordingAtom } from "~/atoms";
import { trpc } from "~/trpc/react";
import RendleyEditor from "~/app/_components/rendley-video-editor/Editor";

interface PageProps {}

const Page: FC<PageProps> = () => {
  const [recording, setRecording] = useAtom(recordingAtom);
  const params = useParams();
  const searchParams = useSearchParams();
  const flagRef = useRef("");

  const {
    data: video,
    isLoading,
    error,
  } = trpc.videoProject.getVideoProjectById.useQuery(
    { id: params["video-id"] as string },
    {
      enabled: flagRef.current === "video",
    },
  );

  const { data: viralClip } = trpc.videoProject.getViralClipById.useQuery(
    { id: params["video-id"] as string },
    {
      enabled: flagRef.current === "viralClip",
    },
  );

  useEffect(() => {
    flagRef.current =
      searchParams.get("viralClips") === "true" ? "viralClip" : "video";

    if (video) {
      console.log("found video");
      setRecording(video);
    }
    if (viralClip) {
      console.log("found viral clip");
      setRecording(viralClip);
      console.log(recording, "recording");
    }
  }, [video, viralClip, recording, searchParams, setRecording]);

  return (
    <div>
      {recording ? (
        <RendleyEditor recording={recording} />
      ) : (
        <p>No video found.</p>
      )}
    </div>
  );
};

export default Page;
