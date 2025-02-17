import { FC, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { trpc } from "~/trpc/react";
import TopLoader from "~/components/loaders/top-loader";
import { XWTextarea } from "~/components/reusable/XWTextarea";
import XWButton from "~/components/reusable/XWButton";

interface GenerateImageProps {
  recording: any;
  rendley: any;
}

const GenerateImage: FC<GenerateImageProps> = ({ rendley }) => {
  const [userInput, setUserInput] = useState("");
  const [fileKey, setFileKey] = useState("");
  const [generatedImage, setGeneratedImage] = useState(false);
  const [loadingGeneration, setLoadingGeneration] = useState(false);

  const { mutateAsync: generateAIImage } =
    trpc.videoProject.AIimageBrollsCreation.useMutation();

  const {
    data: fileUrl,
    isLoading,
    isError,
  } = trpc.aws.getObjectURL.useQuery(
    {
      key: fileKey,
    },
    {
      enabled: !!fileKey,
    },
  );

  const addToVideo = async () => {
    setLoadingGeneration(true);

    const rendleyVideoEditor = rendley.current;
    const engineInstance = await rendleyVideoEditor.getEngine();
    const engine = engineInstance.getInstance();
    const mediaId = await engine.getLibrary().addMedia(fileUrl);
    const time = await engine.getTimeline().currentTime;
    const videoLayer = engine.getTimeline().createLayer();
    const videoClip = await videoLayer.addClip({
      mediaDataId: mediaId,
      startTime: time,
    });
    setLoadingGeneration(false);
  };

  const handleGenerate = async () => {
    setLoadingGeneration(true);
    if (userInput === "") {
      toast.error("Please enter a prompt");
      return;
    } else {
      try {
        const res = await generateAIImage({
          userPrompt: userInput,
        });
        setFileKey(res.file);
        setGeneratedImage(true);
      } catch (error) {
        console.error("Error generating AI image:", error);
      }
    }
    setLoadingGeneration(false);
  };

  return (
    <div>
      {loadingGeneration && <TopLoader />}
      <XWTextarea
        placeholder="Input your prompt here..."
        onChange={(e) => setUserInput(e.target.value)}
        required
      />
      <XWButton
        className1="w-full mt-5"
        onClick={() => {
          handleGenerate();
        }}
      >
        {fileUrl ? "Regenerate" : "Generate"}
      </XWButton>
      {fileUrl && (
        <>
          <Image
            src={fileUrl}
            alt="Generated Image"
            className="mt-5 w-full rounded-lg"
            width={400}
            height={400}
          />
          <XWButton className1="w-full mt-5" onClick={addToVideo}>
            Add to Video
          </XWButton>
        </>
      )}
    </div>
  );
};

export default GenerateImage;
