import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TranscriptionFieldProps {
  type: string;
  inputType: string;
  formData: Record<string, string>;
  isTranscribing: boolean;
  showUrlInput: Record<string, boolean>;
  transcribedFields: Record<string, boolean>;
  onInputChange: (field: string, value: string) => void;
  onUrlInputToggle: (type: string, showUrl: boolean) => void;
  onFileUpload: (type: string, file: File) => void;
  onUrlTranscription: (type: string, url: string) => void;
  onTranscriptEdit: (type: string, transcript: string) => void;
}

export const TranscriptionField = ({
  type,
  inputType,
  formData,
  isTranscribing,
  showUrlInput,
  transcribedFields,
  onInputChange,
  onUrlInputToggle,
  onFileUpload,
  onUrlTranscription,
  onTranscriptEdit,
}: TranscriptionFieldProps) => {
  return (
    <div className="space-y-4">
      {!transcribedFields[type] ? (
        <div className="flex flex-col gap-3">
          <div className="mb-4 flex gap-4">
            <Button
              onClick={() => onUrlInputToggle(type, false)}
              className={cn(
                "flex-1 text-base font-medium",
                !showUrlInput[type] ? "bg-indigo-600" : "bg-gray-700",
              )}
            >
              Upload File
            </Button>
            <Button
              onClick={() => onUrlInputToggle(type, true)}
              className={cn(
                "flex-1 text-base font-medium",
                showUrlInput[type] ? "bg-indigo-600" : "bg-gray-700",
              )}
            >
              Enter URL
            </Button>
          </div>

          {showUrlInput[type] ? (
            <div className="space-y-4">
              <Input
                type="url"
                placeholder={`Enter ${inputType.toLowerCase()} URL (YouTube or direct link)`}
                className="h-12 w-full rounded-xl border-2 border-gray-700/50 bg-gray-900/50 text-lg text-gray-200"
                onChange={(e) => onInputChange(type, e.target.value)}
                disabled={isTranscribing}
              />
              <Button
                onClick={() => onUrlTranscription(type, formData[type])}
                disabled={!formData[type] || isTranscribing}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isTranscribing ? "Transcribing..." : "Transcribe URL"}
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "border-3 flex min-h-[250px] w-full flex-col items-center justify-center gap-6 rounded-xl border-dashed p-8",
                isTranscribing && "pointer-events-none opacity-50",
              )}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600/20">
                <svg
                  className="h-10 w-10 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">
                  Drag & Drop your {inputType.toLowerCase()} file here
                </p>
                <p className="text-base text-gray-400">or</p>
              </div>
              <input
                type="file"
                accept={inputType === "Video" ? "video/*" : "audio/*"}
                className="hidden"
                id={`file-${type}`}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onFileUpload(type, file);
                  }
                }}
                disabled={isTranscribing}
              />
              <label
                htmlFor={`file-${type}`}
                className={cn(
                  "cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 font-medium text-white shadow-xl transition-all duration-300 hover:from-indigo-500 hover:to-violet-500",
                  isTranscribing && "cursor-not-allowed opacity-70",
                )}
              >
                Select file from your computer
              </label>
              {formData[type] && (
                <div className="text-base text-gray-300/90">
                  Selected file: {formData[type]}
                </div>
              )}
              {isTranscribing && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
                  <div className="text-white">Transcribing...</div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            value={formData[type] || ""}
            onChange={(e) => onInputChange(type, e.target.value)}
            className="min-h-[150px] rounded-xl border-2 border-gray-700/50 bg-gray-900/50 text-lg text-gray-200"
            placeholder="Edit transcribed text..."
          />
          {/* <Button
            onClick={() => onTranscriptEdit(type, formData[type] || "")}
            className="text-base font-medium text-indigo-400 hover:text-indigo-300"
          >
            Edit Transcript
          </Button> */}
        </div>
      )}
    </div>
  );
};
