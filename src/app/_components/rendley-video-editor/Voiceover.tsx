import { FC, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { trpc } from "~/trpc/react";
import { SpeedOptions } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { useGenerationHelpers } from "~/hooks/soundverse/useGenerationHelpers";
import TopLoader from "~/components/loaders/top-loader";
import { XWTextarea } from "~/components/reusable/XWTextarea";
import XWButton from "~/components/reusable/XWButton";

interface VoiceoverProps {
  recording: any;
  rendley: any;
}

const Voiceover: FC<VoiceoverProps> = ({ recording, rendley }: any) => {
  const [userInput, setUserInput] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [fileKey, setFileKey] = useState("");
  const [ready, setReady] = useState(false);
  const { data: voices } = trpc.audio.getAllVoices.useQuery();
  const [loadingVoiceover, setLoadingVoiceover] = useState(false);

  const { generateVoice } = useGenerationHelpers();
  const { user } = useUser();

  const {
    data: fileUrl,
    isLoading,
    isError,
    isSuccess: fetchingFileUrlSuccess,
  } = trpc.aws.getObjectURL.useQuery(
    {
      key: fileKey as string,
    },
    {
      enabled: ready,
    },
  );

  useEffect(() => {
    if (fetchingFileUrlSuccess) {
      const addMediaToEditor = async () => {
        try {
          const rendleyVideoEditor = rendley.current;
          const engineInstance = await rendleyVideoEditor.getEngine();
          const engine = engineInstance.getInstance();
          const mediaId = await engine.getLibrary().addMedia(fileUrl);
          const time = await engine.getTimeline().currentTime;
          const videoLayer = engine.getTimeline().createLayer();
          await videoLayer.addClip({
            mediaDataId: mediaId,
            startTime: time,
          });
        } catch (err) {
          console.error("Error adding media to editor:", err);
        }
      };

      addMediaToEditor();
    }
  }, [fetchingFileUrlSuccess, fileUrl]);

  const generateVoiceover = async (userText: string, voiceId: string) => {
    const payload = {
      userId: user?.id as string,
      transcript: userText as string,
      voiceId: voiceId as string,
      speed: SpeedOptions.normal,
      language: 'en',
    };

    const fileKey = await generateVoice(payload);
    setFileKey(fileKey);

    setReady(true);
  };

  return (
    <div className="space-y-4 p-4">
      {loadingVoiceover && <TopLoader />}
      <h2 className="text-lg font-semibold">Generate Voiceover using AI</h2>
      <div className="space-y-4">
        <XWTextarea
          placeholder="Write your script here..."
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="max-w-64">
          <Select
            onValueChange={(value) => {
              setVoiceId(value); // Update the currently selected voice ID
            }}
          >
            <SelectTrigger aria-label="Voice Selector">
              {voiceId
                ? `Voice: ${voices?.find((voice: any) => voice.id === voiceId)?.name || "Unknown voice"}`
                : "Select speaker voice"}
            </SelectTrigger>
            <SelectContent>
              {voices &&
                voices.map((voice: any) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <XWButton
          className1="w-full"
          onClick={() => {
            generateVoiceover(userInput, voiceId);
          }}
        >
          Generate Speech
        </XWButton>
      </div>
    </div>
  );
};

export default Voiceover;
