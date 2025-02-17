import Image from "next/image";
import { FC } from "react";
import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import { trpc } from "~/trpc/react";

interface ShowMediaProps {
  rendley: any;
}

const ShowMedia: FC<ShowMediaProps> = ({ rendley }) => {
  const { data: defaultSpace, isLoading: isWorkspaceFetching } =
    useGetActiveSpace();

  const { data: audioMedia, isLoading: isAudioLoading } =
    trpc.audio.getAudioRecords.useQuery(
      { workspaceId: defaultSpace?.id },
      { enabled: !!defaultSpace?.id },
    );

  const { data: generatedImages, isLoading: isImagesLoading } =
    trpc.image.getGeneratedImages.useQuery(
      {
        workspaceId: defaultSpace?.id!,
        limit: 20,
        generationType: "TEXT_TO_IMAGE",
      },
      { enabled: !!defaultSpace?.id },
    );

  // const key = img.imageKey?.split("/").pop()?.replace(".png", "") || "";

  const audioKeys =
    audioMedia
      ?.map((audio) => audio.audioKey)
      .filter((key): key is string => key !== undefined) || [];

  const imageKeys =
    generatedImages
      ?.map((image) => image.imageKey.split("/").pop()?.replace(".png", ""))
      .filter((key): key is string => key !== undefined) || [];

  const { data: urls, isLoading: isUrlsLoading } =
    trpc.aws.getBatchObjectURLs.useQuery(
      { keys: [...audioKeys, ...imageKeys] },
      { enabled: audioKeys.length > 0 || imageKeys.length > 0 },
    );
  const audioUrls = urls?.slice(0, audioKeys.length) ?? [];
  const imageUrls = urls?.slice(audioKeys.length) ?? [];

  if (
    isWorkspaceFetching ||
    isAudioLoading ||
    isImagesLoading ||
    isUrlsLoading
  ) {
    return <div>Loading...</div>;
  }

  const addMediaToEditor = async (fileUrl: string) => {
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
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Images</h2>
        <div>
          <h4 className="font-semibold">Generated Images</h4>
          <div className="grid grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <Image
                width={100}
                height={100}
                key={index}
                src={url}
                alt={`Generated ${index}`}
                className="mb-2 h-auto max-w-xs cursor-pointer"
                onClick={() => {
                  addMediaToEditor(url);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Audio</h2>
        <div>
          <h4 className="font-semibold">Generated Audio</h4>
          {audioUrls.map((url, index) => (
            <audio key={index} controls className="mb-2">
              <source src={url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowMedia;
