import { FC, useState } from "react";
import { XWInput } from "~/components/reusable/XWInput";
import { useAtom } from "jotai";
import { videoUrlAtom, youTubeUrlAtom } from "~/atoms";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { isValidYoutubeUrl } from "~/utils/utils";
import { useRouter } from "next/navigation";
import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import { useUser } from "@clerk/nextjs";
import { trpc } from "~/trpc/react";

interface YoutubeUploadProps {}

const YoutubeUpload: FC<YoutubeUploadProps> = ({}) => {
  const [youtubeUrl, setYoutubeUrl] = useAtom<string>(youTubeUrlAtom);
  const [processing, setProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useAtom<string>(videoUrlAtom);
  const [language, setLanguage] = useState<string>("en");
  const [metadata, setMetadata] = useState<any | null>(null);
  const [cloudinaryData, setCloudinaryData] = useState<any | null>(null);

  const router = useRouter();

  const { mutateAsync: createVideoProject } =
    trpc.videoProject.createVideoProject.useMutation();

  const { data: defaultSpace, isLoading: isWorkspaceFetching } =
    useGetActiveSpace();

  const { user } = useUser();

  const processingVideo = async () => {
    if (youtubeUrl.length > 0) {
      if (isValidYoutubeUrl(youtubeUrl)) {
        setVideoUrl(youtubeUrl);
        try {
          // Fetch metadata and cloudinaryData
          const [cloudData, metadataData] = await getYoutubeVideoMetadata();

          // Pass directly to addVideoProject
          await addVideoProject(metadataData, cloudData);
        } catch (error) {
          console.error("Error during processing:", error);
          toast.error("Error processing the video. Please try again.");
        }
      } else {
        toast.error("Enter a valid Youtube URL");
      }
    }
  };

  const getYoutubeVideoMetadata = async () => {
    try {
      const [processResponse, generateResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/youtube/process`, {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
          },
          body: JSON.stringify({ youtubeUrl }),
        }),
        fetch(
          `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/generate-all`,
          {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
            },
            body: JSON.stringify({
              url: youtubeUrl,
              type: "youtube",
              languagecode: language,
            }),
          },
        ),
      ]);

      const processData = await processResponse.json();
      const generateData = await generateResponse.json();

      return [processData, generateData]; // Return both values
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while fetching the audio. Please try again.",
      );
      throw error; // Propagate the error
    }
  };

  const addVideoProject = async (data: any, cloudData: any) => {
    try {
      const videoId = await createVideoProject({
        title: data.title,
        description: data.description,
        ytChapters: JSON.stringify(data.chapters),
        transcript: data.transcript,
        subtitles: data.subtitles,
        words: JSON.stringify(data.words),
        workspaceId: defaultSpace!.id,
        processStatus: "PROCESSING",
        videoType: "YOUTUBE",
        createdBy: user?.id as string,
        duration: cloudData.duration as number,
        thumbnailUrl: cloudData.thumbnailUrl,
        videoUrl: cloudData.publicUrl,
      });
      router.push(`/videoverse/${videoId.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Error processing the video");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="">Import Url</label>
      <XWInput
        className="w-full"
        placeholder="Copy URL here from youtube"
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />
      <Button variant={"default"} onClick={processingVideo}>
        Process Video
        {/* {processing ? (
          <LoaderCircle className="animate-spin h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )} */}
      </Button>
    </div>
  );
};

export default YoutubeUpload;
