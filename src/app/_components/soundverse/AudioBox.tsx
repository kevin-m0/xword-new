"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import {
  Play,
  Pause,
  Download,
  Trash2,
  Volume2,
  ChevronDown,
  ChevronUp,
  Repeat,
} from "lucide-react";
import { Button } from "~/components/ui/button";
// import { useDeleteAudioModels } from "../../_hooks/soundverse/useDeleteAudioRecords"; // <-- import your custom hook
import { trpc } from "~/trpc/react";
import AddDoc from "~/icons/AddDoc";
import { XWSlider } from "~/components/reusable/XWSlider";
import { useDeleteAudioModels } from "~/hooks/soundverse/useDeleteAudioRecords";

interface AudioBoxProps {
  audioId?: string; // <-- NEW: pass the DB ID (e.g., audio.id) here
  name?: string;
  avatar?: string;
  script?: string; // script text (markdown)
  audioKey: string; // URL or path to your audio
  hideMetadata?: boolean; // if true, hides metadata (top area)
  onAudioDeleted?: () => void;
}

const AudioBox = ({
  audioId, // <-- New prop
  name = "Emma Watson",
  avatar = "/images/user2.png",
  script = "",
  audioKey,
  hideMetadata = false,
  onAudioDeleted,
}: AudioBoxProps) => {
  const [isScriptVisible, setIsScriptVisible] = useState(false);
  const [isControlsVisible, setIsContorlsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio progress
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Volume
  const [volume, setVolume] = useState(1.0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { data: audioUrl } = trpc.aws.getObjectURL.useQuery({ key: audioKey });

  // Hook for deleting
  const { mutate: deleteAudio } = useDeleteAudioModels();

  // Handlers
  const toggleScript = () => setIsScriptVisible((prev) => !prev);
  const toggleControls = () => setIsContorlsVisible((prev) => !prev);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Delete audio
  const handleDelete = () => {
    if (!audioId) return;
    deleteAudio(
      { modelId: audioId },
      {
        onSuccess: () => {
          // Call parent callback if present
          if (onAudioDeleted) onAudioDeleted();
        },
      },
    );
  };

  // On mount, attach event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleLoadedMetadata = () => setDuration(audioElement.duration || 0);
    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Seek when progress slider changes
  const handleProgressChange = useCallback(
    (newValues: number[]) => {
      if (!audioRef.current) return;
      const newTime = newValues[0];
      const clampedTime = Math.min(Math.max(newTime as number, 0), duration);
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    },
    [duration],
  );

  // Volume slider changes
  const handleVolumeChange = useCallback((newValues: number[]) => {
    setVolume(newValues[0] as number);
  }, []);

  // Time format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const s = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${s}`;
  };

  return (
    <div className="xw-audio-box from-xw-background to-xw-background/50 scrollbar-track-transparent scrollbar-thumb-xw-secondary scrollbar-thin flex max-h-[800px] flex-col gap-4 overflow-y-auto rounded-lg bg-gradient-to-b p-5">
      {/* Top metadata row */}
      {!hideMetadata && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <Image src={avatar} alt={name} width={40} height={40} />
            </div>
            <span className="text-sm font-medium">{name}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Script */}
            <Button
              size="icon"
              variant="ghost"
              className={`h-8 w-8 ${isScriptVisible && "bg-xw-secondary-hover"}`}
              onClick={toggleScript}
            >
              <AddDoc />
            </Button>

            {/* Delete button with Trash2 */}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            {/* Show/Hide controls */}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={toggleControls}
            >
              {isControlsVisible ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Script Section */}
      {isScriptVisible && script && (
        <div className="bg-xw-secondary scrollbar-track-transparent scrollbar-thumb-xw-secondary scrollbar-thin max-h-[500px] overflow-y-auto rounded-md p-3">
          <ReactMarkdown>{script}</ReactMarkdown>
        </div>
      )}

      {/* Audio Controls */}
      {isControlsVisible && (
        <div className="flex flex-col gap-2">
          {/* Play / Pause */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              {/* Current / Duration */}
              <span className="text-xs text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Volume Controls */}
            <div className="mr-2 flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-white" />
              <XWSlider
                value={[volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20 rounded-full"
              />
            </div>
          </div>

          {/* Progress Slider */}
          <XWSlider
            className="w-full rounded-full"
            value={[currentTime]}
            max={duration || 0}
            step={0.1}
            onValueChange={handleProgressChange}
          />
        </div>
      )}

      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
};

export default AudioBox;
