"use client";

import React, { useState, useRef, useEffect } from "react";
import TopLoader from "~/components/loaders/top-loader";
import { trpc } from "~/trpc/react";
import { stretchSize } from "~/utils/utils";
import { SelectionMenu } from "./SelectionMenu";

interface Word {
  id: string;
  text: string;
  highlighted: boolean;
  start: number;
  end: number;
  clipId: string | null;
}

interface TranscriptEditorProps {
  recording: any;
  mainClipId: string;
  rendley: any;
  mainClipLayer: any;
  handleMainClipId: (id: string) => void;
}

export default function TranscriptEditor({
  recording,
  rendley,
  mainClipId,
  mainClipLayer,
  handleMainClipId,
}: TranscriptEditorProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [selectedRange, setSelectedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<string>("");
  const [generatingBroll, setGeneratingBroll] = useState<boolean>(false);
  const [fileKey, setFileKey] = useState("");

  const { mutateAsync: stockVideoBroll } =
    trpc.videoProject.brollsCreation.useMutation();
  const { mutateAsync: stockImageBroll } =
    trpc.videoProject.imageBrollsCreation.useMutation();
  const { mutateAsync: aiImageBroll } =
    trpc.videoProject.AIimageBrollsCreation.useMutation();

  useEffect(() => {
    const transcript = JSON.parse(recording?.words);
    const wordsData = transcript.map((word: any) => ({
      id: word.id,
      text: word.text,
      highlighted: false,
      start: word.start,
      end: word.end,
      clipId: null,
    }));
    setWords(wordsData); // Set state once after mapping the data
  }, []);

  const handleMouseDown = (index: number) => {
    setIsSelecting(true);
    setSelectedRange({ start: index, end: index });
    setMenuPosition(null);
  };

  const handleMouseMove = (index: number) => {
    if (isSelecting) {
      setSelectedRange((prev) => (prev ? { ...prev, end: index } : null));
    }
  };

  const handleMouseUp = async (event: React.MouseEvent) => {
    setIsSelecting(false);

    if (selectedRange) {
      if (selectedRange.start > selectedRange.end) {
        return;
      }

      const rect = editorRef.current?.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (rect) {
        let top = event.clientY - rect.top + 10;
        let left = event.clientX - rect.left;

        // Adjust if the menu goes out of bounds
        const menuWidth = 150; // Estimated width of the menu
        const menuHeight = 50; // Estimated height of the menu

        // Adjust horizontally
        if (left + menuWidth > rect.width) {
          left = rect.width - menuWidth - 10; // Add some padding
        }
        if (left < 0) {
          left = 10; // Prevent overflow to the left
        }

        // Adjust vertically
        if (top + menuHeight > rect.height) {
          top = rect.height - menuHeight - 10; // Add some padding
        }
        if (top < 0) {
          top = 10; // Prevent overflow to the top
        }

        setMenuPosition({ top, left });
      }

      const { start, end } = selectedRange;

      const selectedWords = words
        .slice(Math.min(start, end), Math.max(start, end) + 1)
        .map((word) => ({
          text: word.text,
          start: word.start,
          end: word.end,
        }));

      setSelectedText(selectedWords.map((word) => word.text).join(" "));
      setStartTime(selectedWords[0]?.start as number);
      setEndTime(selectedWords[selectedWords.length - 1]?.end as number);

      const rendleyVideoEditor = rendley.current;
      const engineInstance = await rendleyVideoEditor.getEngine();
      const engine = engineInstance.getInstance();
      const timeline = engine.getTimeline();

      await timeline.seek((selectedWords[0]?.start as number) / 1000);
    }
  };

  const isWordSelected = (index: number) => {
    if (!selectedRange) return false;
    const { start, end } = selectedRange;
    return index >= Math.min(start, end) && index <= Math.max(start, end);
  };

  const handleRegenerate = () => {
    console.log("Regenerating transcript...");
  };

  const handleHighlight = (videoClipId: any) => {
    if (selectedRange) {
      const { start, end } = selectedRange;
      setWords(
        words.map((word, index) =>
          index >= Math.min(start, end) && index <= Math.max(start, end)
            ? { ...word, highlighted: true, clipId: videoClipId }
            : word,
        ),
      );
    }
    setMenuPosition(null);
    setSelectedRange(null);
  };

  const handleRemoveHighlight = async () => {
    if (selectedRange) {
      const { start, end } = selectedRange;

      const rendleyVideoEditor = rendley.current;
      const engineInstance = await rendleyVideoEditor.getEngine();
      const engine = engineInstance.getInstance();
      const timeline = engine.getTimeline();
      await timeline.removeClip(words[start]?.clipId);

      setWords(
        words.map((word) =>
          word.clipId === words[start]?.clipId
            ? { ...word, highlighted: false, clipId: null }
            : word,
        ),
      );
      // const clip = await timeline.getClipById(words[start].clipId);
    }
    setMenuPosition(null);
    setSelectedRange(null);
  };

  const handleDelete = async () => {
    if (selectedRange) {
      const { start, end } = selectedRange;
      setWords(
        words.filter(
          (_, index) =>
            index < Math.min(start, end) || index > Math.max(start, end),
        ),
      );

      const startTime = words[start]?.start;
      const endTime = words[end]?.end;

      const rendleyVideoEditor = rendley.current;
      const engineInstance = await rendleyVideoEditor.getEngine();
      const engine = engineInstance.getInstance();

      // splitVideo(mainClipId, endTime / 1000);

      handleMiddleSplit(
        mainClipId,
        (startTime as number) / 1000,
        (endTime as number) / 1000,
      );
    }

    setMenuPosition(null);
    setSelectedRange(null);
  };

  const handleMiddleSplit = async (
    mainClipId: string,
    startTime: number,
    endTime: number,
  ) => {
    const rendleyVideoEditor = rendley.current;
    const engineInstance = await rendleyVideoEditor.getEngine();
    const engine = engineInstance.getInstance();
    const timeline = engine.getTimeline();

    const clip = await timeline.getClipById(mainClipId);

    const clone1 = await clip.clone(); // Clone the original clip
    const clone2 = await clip.clone(); // Clone the original clip again

    const videoLayer = engine.getTimeline().createLayer(); // Create the first video layer
    const videoLayer2 = engine.getTimeline().createLayer(); // Create the second video layer

    // Add the clones to the timeline in separate layers
    const clonedClip1 = await videoLayer.addClip({
      mediaDataId: clone1.mediaDataId,
    });
    const clonedClip2 = await videoLayer2.addClip({
      mediaDataId: clone2.mediaDataId,
    });

    // Remove the original clip from the timeline
    await engine.getTimeline().removeClip(clip.id);

    // Get the start and end times for the original clip
    const clone1StartTime = await clone1.getStartTime(); // Start time of the first clone
    const clone1EndTime = await clone1.getEndTime(); // End time of the first clone

    const splitTime = (clone1EndTime + clone1StartTime) / 2; // Calculate the split time (mid-point)

    const clone2StartTime = splitTime; // Set start time of the second clip to the split point
    const clone2EndTime = await clone2.getEndTime(); // End time of the second clip

    // Set the trims for both cloned clips
    await clonedClip1.setRightTrim(splitTime); // Trim the first clone to the split point
    await clonedClip2.setLeftTrim(splitTime); // Trim the second clone from the split point

    // Adjust the duration for each cloned clip based on the trim settings
    const duration1 = splitTime - clone1StartTime;
    const duration2 = clone2EndTime - splitTime;

    const mediaData1 = engine
      .getLibrary()
      .getMediaById(clone1.mediaDataId as string);
    const scale = stretchSize(
      mediaData1.width as number,
      mediaData1.height as number,
      engine.getDisplay().getWidth(),
      engine.getDisplay().getHeight(),
    );
    clonedClip1.style.setScale(scale[0], scale[1]);

    const mediaData2 = engine
      .getLibrary()
      .getMediaById(clone2.mediaDataId as string);
    const scale2 = stretchSize(
      mediaData2.width as number,
      mediaData2.height as number,
      engine.getDisplay().getWidth(),
      engine.getDisplay().getHeight(),
    );
    clonedClip2.style.setScale(scale2[0], scale[1]);
  };

  const splitVideo = async (clipId: string, splitTime: number) => {
    const rendleyVideoEditor = rendley.current;
    const engineInstance = await rendleyVideoEditor.getEngine();
    const engine = engineInstance.getInstance();
    const timeline = engine.getTimeline();

    // Get the main clip
    const clip = await timeline.getClipById(clipId);

    // Get the original start and end times
    const originalStartTime = await clip.getStartTime(); // In seconds
    const originalEndTime = await clip.getEndTime(); // In seconds

    if (splitTime <= originalStartTime || splitTime >= originalEndTime) {
      console.error("Split time is out of bounds.");
      return;
    }

    // Clone the clip to create the second segment
    const newClip = await clip.clone();
    const videoLayer = engine.getTimeline().createLayer();
    const clonedClip = await videoLayer.addClip({
      mediaDataId: newClip.mediaDataId,
    });
    clip.setMuted(true);

    // Set trims for the first clip (0 to splitTime)
    // await clip.setRightTrim(splitTime);
    // mainClipLayer.setVisibility(false);
    // await engine.getTimeline().getLayerById(mainClipLayer).setVisibility(false);
    //remove the original clip

    // Set trims for the second clip (splitTime to original end)
    await clonedClip.setLeftTrim(splitTime);

    const mediaData = engine
      .getLibrary()
      .getMediaById(newClip.mediaDataId as string);
    const scale = stretchSize(
      mediaData.width as number,
      mediaData.height as number,
      engine.getDisplay().getWidth(),
      engine.getDisplay().getHeight(),
    );
    clonedClip.style.setScale(scale[0], scale[1]);

    await engine.getTimeline().removeClip(clip.id);

    handleMainClipId(clonedClip.id);

    // await clip.offload();
  };

  const { data: fileUrl } = trpc.aws.getObjectURL.useQuery(
    {
      key: fileKey,
    },
    {
      enabled: !!fileKey,
      onSuccess: async (data) => {
        const rendleyVideoEditor = rendley.current;
        const engineInstance = await rendleyVideoEditor.getEngine();
        const engine = engineInstance.getInstance();
        const mediaId = await engine.getLibrary().addMedia(data);
        const time = await engine.getTimeline().currentTime;
        const videoLayer = engine.getTimeline().createLayer();
        const videoClip = await videoLayer.addClip({
          mediaDataId: mediaId,
          startTime: time,
        });
      },
    },
  );

  const createBrolls = async (
    startTime: number,
    endTime: number,
    selectedText: string,
    type: "image" | "video" | "AIimage",
  ) => {
    setGeneratingBroll(true);

    const rendleyVideoEditor = rendley.current;
    const engineInstance = await rendleyVideoEditor.getEngine();
    const engine = engineInstance.getInstance();
    let pexelVideoUrl = "";

    if (type === "video") {
      try {
        const { outputFile } = await stockVideoBroll({
          selectedText: selectedText,
        });
        pexelVideoUrl = outputFile;
      } catch (error) {
        handleRemoveHighlight();
        console.error("Error creating B-rolls:", error);
        setGeneratingBroll(false);
      }
    }
    if (type === "image") {
      try {
        const { outputFile } = await stockImageBroll({
          selectedText: selectedText,
        });
        pexelVideoUrl = outputFile;
      } catch (error) {
        handleRemoveHighlight();
        console.error("Error creating B-rolls:", error);
        setGeneratingBroll(false);
      }
    }

    if (pexelVideoUrl) {
      const mediaId = await engine.getLibrary().addMedia(pexelVideoUrl);
      const videoLayer = engine.getTimeline().createLayer();
      const videoClip = await videoLayer.addClip({
        mediaDataId: mediaId,
      });
      handleHighlight(videoClip.id);

      videoClip.setStartTime(startTime / 1000);
      // videoClip.setRightTrim(endTime / 1000);
      videoClip.duration = endTime / 1000 - startTime / 1000;

      const mediaData = engine.getLibrary().getMediaById(mediaId as string);
      const scale = stretchSize(
        mediaData.width as number,
        mediaData.height as number,
        engine.getDisplay().getWidth(),
        engine.getDisplay().getHeight(),
      );
      videoClip.style.setScale(scale[0], scale[1]);

      // let clip1MediaData = engine.getLibrary().getMediaById(mediaId);
      // let scale1 = stretchSize(
      //   videoClip.style.getRawWidth(),
      //   videoClip.style.getRawHeight(),
      //   engine.getDisplay().getWidth(),
      //   engine.getDisplay().getHeight(),
      // );
      // if (type === "video") {
      //   videoClip.style.setScale(scale1[0], scale1[1]);
      // }
    } else {
      console.log("no video provided from pexel");
    }

    if (type === "AIimage") {
      try {
        const { file } = await aiImageBroll({
          userPrompt: selectedText,
        });
        setFileKey(file);
      } catch (error) {
        handleRemoveHighlight();
        console.error("Error creating B-rolls:", error);
        setGeneratingBroll(false);
      }
    }

    if (fileUrl) {
      const mediaId = await engine.getLibrary().addMedia(fileUrl);
      const videoLayer = engine.getTimeline().createLayer();
      const videoClip = await videoLayer.addClip({
        mediaDataId: mediaId,
        startTime: startTime / 1000,
        duration: endTime / 1000 - startTime / 1000,
      });
      videoClip.duration = endTime / 1000 - startTime / 1000;
    }

    setGeneratingBroll(false);
    setMenuPosition(null);
    setSelectedRange(null);
  };

  return (
    <div className="z-50 mx-auto p-4">
      {generatingBroll && <TopLoader />}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">
          TRANSCRIPT
        </h2>
        {/* <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={handleRegenerate}
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Something wrong? Regenerate
        </Button> */}
      </div>

      <div
        ref={editorRef}
        className="relative select-none space-y-2"
        onMouseLeave={() => {
          setIsSelecting(false);
          setMenuPosition(null);
        }}
      >
        {words.map((word, index) => (
          <span
            key={word.id}
            onMouseDown={() => handleMouseDown(index)}
            onMouseMove={() => handleMouseMove(index)}
            onMouseUp={handleMouseUp}
            className={`inline-block cursor-pointer px-1 py-0.5 transition-colors ${
              isWordSelected(index)
                ? "bg-yellow-200 text-black"
                : word.highlighted
                  ? "bg-gray-500"
                  : "hover:bg-yellow-50 hover:text-black"
            }`}
          >
            {word.text}
          </span>
        ))}
        {menuPosition && selectedRange && (
          <SelectionMenu
            startTime={startTime}
            endTime={endTime}
            selectedText={selectedText}
            onAIBRoll={createBrolls}
            top={menuPosition.top}
            left={menuPosition.left}
            onDelete={handleDelete}
            onRemoveHighlight={handleRemoveHighlight}
          />
        )}
      </div>
    </div>
  );
}
