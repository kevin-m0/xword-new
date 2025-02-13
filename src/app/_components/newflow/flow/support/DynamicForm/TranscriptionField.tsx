import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Check } from "lucide-react";
import XWDropBox from "~/components/reusable/XWDropBox";

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
  setIsInputDataComplete: (value: boolean) => void;
  setTranscript: (value: string) => void;
  transcript: string;
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
  setTranscript,
  transcript,
  setIsInputDataComplete,
}: TranscriptionFieldProps) => {
  const [localFile, setLocalFile] = useState<any | null>(null);

  const handleOnFileChange = useCallback(
    (file: File | null) => {
      if (file) {
        setLocalFile({ file, isUploading: true });
        onFileUpload(type, file);
        setLocalFile({ file, isUploading: false }); // Update after upload
      } else {
        setLocalFile(null);
        setIsInputDataComplete(false);
      }
    },
    [onFileUpload, setIsInputDataComplete, type],
  );

  return (
    <div className="space-y-4">
      {!transcribedFields[type] ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Input
              type="url"
              placeholder={`Enter ${inputType.toLowerCase()} URL (YouTube or direct link)`}
              onChange={(e) => onInputChange(type, e.target.value)}
              disabled={isTranscribing}
              className="flex-1"
            />
            <div>
              <Button
                onClick={() =>
                  onUrlTranscription(type, formData[type] as string)
                }
                disabled={!formData[type] || isTranscribing}
                size={"icon"}
                variant={"default"}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-xw-border relative w-full border-t">
            <div className="bg-xw-sidebar absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform p-1">
              OR
            </div>
          </div>

          <div>
            <XWDropBox
              title={`Drag & Drop Your ${inputType.toLowerCase()} File`}
              description=".mp4, .mp3, .wav, .ogg, .m4a etc. are allowed."
              acceptTypes={
                inputType.toLocaleLowerCase() === "video"
                  ? { "video/*": [] }
                  : { "audio/*": [] }
              }
              onFileChange={handleOnFileChange}
              value={localFile ? localFile.file : null}
              replacable={true}
              onRemove={() => setTranscript("")}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            value={formData[type] || ""}
            onChange={(e) => onInputChange(type, e.target.value)}
            placeholder="Edit transcribed text..."
          />
        </div>
      )}
    </div>
  );
};
