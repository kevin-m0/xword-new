"use client";

import Script from "next/script";
import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { stretchSize } from "~/utils/utils";
import { ArrowLeft } from "lucide-react";
import { EditorSidebar } from "./EditorSidebar";
import { uploadFile } from "~/services/aws-file-upload";
import { useKeyboardShortcut } from "~/hooks/videoverse/useKeyboardShortcut";
import { trpc } from "~/trpc/react";
import LoadingModal from "~/app/_components/videoverse/Editor/LoadingModal";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { Button } from "~/components/ui/button";

interface RendleyEditorProps {
  recording: any;
}

const RendleyEditor: FC<RendleyEditorProps> = ({ recording }) => {
  const [openModal, setModalOpen] = useState(false);
  const rendleyRef = useRef<any>(null);
  const [editorReady, setEditorReady] = useState(false);
  // const [uniqueKey, setUniqueKey] = useState(Date.now()); // Key to force re-mount
  const [mainClipId, setMainClipId] = useState("");
  const [mainClipLayer, setMainClipLayer] = useState("");
  const [loaded, setLoaded] = useState(false);

  const handleMainClipId = (id: string) => {
    setMainClipId(id);
  };

  //save is ctrl+s
  useKeyboardShortcut(["s"], (event) => {
    if (event.ctrlKey) {
      event.preventDefault(); // Prevent browser's default "Save Page" action
      saveProject();
    }
  });

  const { mutateAsync: saveRecordingState } =
    trpc.videoProject.saveVideoProjectState.useMutation();

  const loadInitVideo = async () => {
    const engineInstance = await rendleyRef.current.getEngine();
    const engine = engineInstance.getInstance();
    console.log("Loading default video...");
    const ffmpeg = engine.getFFmpeg();
    if (ffmpeg.loaded === false) return;
    const mediaId = await engine.getLibrary().addMedia(`${recording.videoUrl}`);
    const videoLayerMain = engine.getTimeline().createLayer();
    setMainClipLayer(videoLayerMain.id);
    const clip = await videoLayerMain.addClip({
      mediaDataId: mediaId,
      startTime: 0,
    });
    setMainClipId(clip.id);
    const mediaData = engine.getLibrary().getMediaById(mediaId as string);
    mediaData.setPermanentUrl(recording.videoUrl);
    const scale = stretchSize(
      mediaData.width as number,
      mediaData.height as number,
      engine.getDisplay().getWidth(),
      engine.getDisplay().getHeight(),
    );
    clip.style.setScale(scale[0], scale[1]);
    setLoaded(true);

    if (engine) {
      engine.events.on("library:added", ({ mediaDataId }: any) => {
        handleMediaAdded(mediaDataId);
      });
    }
  };

  const handleMediaAdded = async (mediaDataId: string) => {
    try {
      const engineInstance = await rendleyRef.current.getEngine();
      const engine = engineInstance.getInstance();
      const mediaData = engine.getLibrary().getMediaById(mediaDataId);

      const blob = await fetch(mediaData.blobUrl).then((res) => res.blob());
      const file = new File([blob], mediaData.filename, { type: blob.type });

      await uploadFile(file, mediaDataId);

      const url = process.env.NEXT_PUBLIC_AWS_IMAGE_BASE_URL + mediaDataId;

      console.log(url, "aws URL");

      mediaData.setPermanentUrl(url);

      console.log(mediaData, "media data");
    } catch (error) {
      console.error("Error uploading media:", error);
    }
  };

  const initializeEditor = async () => {
    const rendleyVideoEditor = rendleyRef.current;
    if (!rendleyVideoEditor) {
      console.warn("Rendley editor ref is null during initialization.");
      return;
    }

    const handleEditorReady = async () => {
      try {
        const engineInstance = await rendleyVideoEditor.getEngine();
        const engine = engineInstance.getInstance();
        const display = engine.getDisplay();

        display.setResolution(1920, 1080);
        display.setBackgroundColor("#000000");
        setEditorReady(true);

        loadInitVideo();

        console.log("Video editor is ready.");
      } catch (error) {
        console.error("Error initializing Rendley editor:", error);
      }
    };

    rendleyVideoEditor.addEventListener("onReady", handleEditorReady);
  };

  useEffect(() => {
    initializeEditor();
  }, [recording]); // Add uniqueKey to dependency array

  // Trigger re-mount on navigation back to this page

  const saveProject = async () => {
    try {
      const engineInstance = await rendleyRef.current.getEngine();
      const project = engineInstance.instance.serialize();
      const res = await saveRecordingState({
        id: recording.id,
        projectState: JSON.stringify(project),
      });
      if (res) {
        toast.success("Project state saved successfully");
      }
    } catch (e) {
      console.error("Error saving project:", e);
    }
  };

  const exportVideo = async () => {
    try {
      setModalOpen(true);
      const engineInstance = await rendleyRef.current.getEngine();
      const res = await engineInstance.instance.export({
        from: 0,
        type: "VIDEO_AUDIO",
      });

      if (res?.blob) {
        const videoURL = URL.createObjectURL(res.blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = videoURL;
        downloadLink.download = `${recording.title}.mp4`;
        downloadLink.click();
        URL.revokeObjectURL(videoURL);
      }
    } catch (e) {
      console.error("Error exporting video:", e);
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex w-full items-center gap-2 bg-[#121315] px-4 py-4">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href={`/videoverse/${recording?.id}`}>
              <XWSecondaryButton size="icon" rounded="full">
                <ArrowLeft className="h-4 w-4" />
              </XWSecondaryButton>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {recording?.title}
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={"outline"} onClick={saveProject}>
              Save Project
            </Button>
            <Button variant={"outline"} onClick={exportVideo}>
              Export Video as MP4
            </Button>
            <LoadingModal isOpen={openModal} />
          </div>
        </div>
      </div>
      <div className="flex h-[92vh] bg-[#121315]">
        <div className="w-[40%] p-2 selection:bg-yellow-500">
          <EditorSidebar
            recording={recording}
            rendley={rendleyRef}
            mainClipId={mainClipId}
            mainClipLayer={mainClipLayer}
            handleMainClipId={handleMainClipId}
          />
        </div>
        <div
          id="video-editor-container"
          className="z-0 w-[60%] overflow-hidden rounded-xl pb-4 pr-4 max-sm:mt-[60px]"
        >
          {/* @ts-ignore */}
          <rendley-video-editor
            ref={rendleyRef}
            licensename={process.env.NEXT_PUBLIC_RENDLEY_LICENSE_NAME}
            licensekey={process.env.NEXT_PUBLIC_RENDLEY_LICENSE_KEY}
            pexelsapikey={process.env.NEXT_PUBLIC_PEXELS_API_KEY}
            giphyapikey={process.env.NEXT_PUBLIC_GIPHY_API_KEY}
            theme="dark"
          />
        </div>
        {/* <div className="w-[20%] selection:bg-yellow-500 p-2">
          <EditorRight recording={recording} rendley={rendleyRef} />
        </div> */}
        <Script id="rendley-video-editor" type="module">
          {`
        import {defineCustomElements} from "https://cdn.rendley.com/sdk/video-editor/1.0.0/loader/index.js";
        defineCustomElements();
        `}
        </Script>
      </div>
    </div>
  );
};

export default RendleyEditor;
