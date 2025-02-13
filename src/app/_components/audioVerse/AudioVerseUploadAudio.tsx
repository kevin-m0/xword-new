import React, { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { UploadCloud } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import {
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CgSpinner } from "react-icons/cg";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { trpc } from "~/trpc/react";
import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import { useUser } from "~/hooks/misc/useUser";
import { uploadFile } from "~/services/aws-file-upload";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogHeader } from "~/components/reusable/xw-dialog";
import XWDropBox from "~/components/reusable/XWDropBox";
import { XWInput } from "~/components/reusable/XWInput";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";

const AudioVerseUploadAudio = () => {
  const [localFile, setLocalFile] = useState<File | null>(null); // Single file state
  const [youtubeURL, setYoutubeURL] = useState<string>("");
  const { showToast } = useXWAlert();
  const utils = trpc.useUtils();
  const { data: defaultSpace } = useGetActiveSpace();

  const { data: user } = useUser();

  const { mutateAsync: getAudioMetadata, isPending: fetchingMetadata } =
    trpc.audioProject.getAudioProjectMetadata.useMutation();

  const { mutateAsync: createAudioProject, isPending: creatingAudioProject } =
    trpc.audioProject.createAudioProject.useMutation();

  const handleFileChange = useCallback(
    async (file: File | null) => {
      if (!file) return;

      setLocalFile(file);

      try {
        const fileKey = crypto.randomUUID();

        if (file.type.startsWith("audio/")) {
          await uploadFile(file, fileKey);
          const metadata = await getAudioMetadata({
            url: fileKey,
            type: "file",
            languagecode: "en",
          });

          await createAudioProject({
            title: metadata.title,
            transcript: metadata.transcript,
            subtitles: metadata.subtitles,
            words: JSON.stringify(metadata.words),
            processStatus: "PROCESSING",
            type: "Upload",
            createdBy: user?.id || "",
            storageKey: fileKey,
            workspaceId: defaultSpace?.id || "",
          });
        } else {
          throw new Error("Unsupported file type");
        }
      } catch (error) {
        console.error("Upload error:", error);
        showToast({
          title: "Upload Failed",
          message: "There was an error uploading your file.",
          variant: "error",
        });
      } finally {
        setLocalFile(null);
      }
    },
    [defaultSpace?.id, showToast],
  );

  const handleYTSubmit = async () => {
    const metadata = await getAudioMetadata({
      url: youtubeURL,
      type: "youtube",
      languagecode: "en",
    });

    await createAudioProject({
      title: metadata.title,
      transcript: metadata.transcript,
      subtitles: metadata.subtitles,
      words: JSON.stringify(metadata.words),
      processStatus: "PROCESSING",
      type: "Upload",
      createdBy: user?.id || "",
      storageKey: youtubeURL,
      workspaceId: defaultSpace?.id || "",
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"default"} size={"sm"}>
            Upload Audio <UploadCloud className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex w-full max-w-lg flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Upload Your Recording
            </DialogTitle>
          </DialogHeader>
          <Separator />

          <XWDropBox
            title="Drag & Drop Your Audio File"
            acceptTypes={{ "audio/*": [], "image/*": [] }}
            description=".mp3, .wav, .aac, etc. are supported"
            value={localFile}
            onFileChange={handleFileChange}
            replacable={false}
          />

          <div className="text-xw-muted-foreground text-center text-lg">OR</div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">Import Url</label>
            <XWInput
              className="w-full"
              placeholder="Copy URL here from youtube"
              onChange={(e) => setYoutubeURL(e.target.value)}
            />
          </div>
          <Separator />

          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <XWSecondaryButton size="sm">Cancel</XWSecondaryButton>
            </DialogClose>
            {fetchingMetadata || creatingAudioProject ? (
              <Button
                variant={"default"}
                size="sm"
                disabled
                onClick={handleYTSubmit}
              >
                Submit
              </Button>
            ) : (
              <Button variant={"default"} size="sm" disabled>
                <CgSpinner className="animate-spin" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AudioVerseUploadAudio;
