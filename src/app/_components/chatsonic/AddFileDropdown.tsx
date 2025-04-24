// AddFileDropdown.tsx

import React, { useCallback, useRef } from "react";
import { toast } from "sonner";
import { Link, AudioLines, Image as ImageIcon, Paperclip } from "lucide-react";
import { trpc } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import AddDoc from "~/icons/AddDoc";
import { uploadFile } from "~/services/aws-file-upload";
import {
  XWDropdown,
  XWDropdownContent,
  XWDropdownItem,
  XWDropdownTrigger,
} from "~/components/reusable/xw-dropdown";
import { UploadedFile } from "~/types/chatsonic.types";

type AddFileDropdownProps = {
  urls: string[];
  updateUrls: (urls: string[]) => void;
  onFileSelect: (
    type: "document" | "image" | "audio",
    file: UploadedFile,
  ) => void;
  isFileUploadDisabled: boolean;
};

export default function AddFileDropdown({
  urls,
  updateUrls,
  onFileSelect,
  isFileUploadDisabled,
}: AddFileDropdownProps) {
  const uploadFileMutation = trpc.aws.getUploadUrl.useMutation();

  const documentInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (file: File, type: "document" | "image" | "audio") => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 10MB");
        return;
      }

      const allowedTypes: Record<string, string[]> = {
        document: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        image: ["image/jpeg", "image/png", "image/gif"],
        audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
      };

      if (!allowedTypes[type]!.includes(file.type)) {
        toast.error(
          `Invalid file type. Allowed types for ${type}: ${allowedTypes[
            type
          ]!.join(", ")}`,
        );
        return;
      }

      const fileId = crypto.randomUUID();

      let finalKey: string;

      type === "document"
        ? (finalKey = fileId)
        : (finalKey = `${fileId}-${file.name.replace(/\s/g, "-")}`);

      const loadingToast = toast.loading("Uploading file...");

      try {
        console.log("finalKey: ", finalKey);
        await uploadFile(file, finalKey);

        let uploadedFile: UploadedFile;

        uploadedFile = {
          id: finalKey,
          mimeType: file.type,
          originalFileName: file.name,
          type: type,
        };

        console.log(uploadedFile);
        onFileSelect(type, uploadedFile); // Pass type and file
        toast.dismiss(loadingToast);
        toast.success("File uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.dismiss(loadingToast);
        toast.error(
          error instanceof Error ? error.message : "Failed to upload file",
        );
      }
    },
    [uploadFileMutation, onFileSelect, uploadFileMutation],
  );

  // File change handlers
  const handleFileChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      type: "document" | "image" | "audio",
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file, type);
        // Reset input
        e.target.value = "";
      }
    },
    [handleFileUpload],
  );

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={documentInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={(e) => handleFileChange(e, "document")}
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, "image")}
      />
      <input
        ref={audioInputRef}
        type="file"
        className="hidden"
        accept="audio/*"
        onChange={(e) => handleFileChange(e, "audio")}
      />

      <XWDropdown>
        <XWDropdownTrigger
          asChild
          disabled={isFileUploadDisabled}
          title={
            isFileUploadDisabled
              ? "Maximum of 3 files uploaded."
              : "Attach Files"
          }
        >
          <div>
            <Button
              variant={"secondary"}
              className="gap-2"
              size="sm"
              disabled={isFileUploadDisabled}
              title={
                isFileUploadDisabled
                  ? "Maximum of 3 files uploaded."
                  : "Attach Files"
              }
            >
              <>
                Select Source
                <Paperclip className="h-4 w-4" />
              </>
            </Button>
          </div>
        </XWDropdownTrigger>

        <XWDropdownContent>
          {/* Document Upload */}
          <XWDropdownItem
            className="cursor-pointer"
            onClick={() => documentInputRef.current?.click()}
          >
            <div className="flex items-center">
              <AddDoc className="mr-1.5 h-[14px] w-[14px]" />
              <span>Upload Document</span>
            </div>
          </XWDropdownItem>

          {/* Image Upload */}
          <XWDropdownItem
            className="cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
          >
            <div className="flex items-center">
              <ImageIcon className="mr-1.5 h-[14px] w-[14px]" />
              <span>Upload Image</span>
            </div>
          </XWDropdownItem>

          {/* Audio Upload */}
          <XWDropdownItem
            className="cursor-pointer"
            onClick={() => audioInputRef.current?.click()}
          >
            <div className="flex items-center">
              <AudioLines className="mr-1.5 h-[14px] w-[14px]" />
              <span>Upload Audio</span>
            </div>
          </XWDropdownItem>

          {/* URL Input */}
          <XWDropdownItem
            className="cursor-pointer"
            onClick={() => updateUrls([...urls, ""])}
          >
            <div className="flex items-center">
              <Link className="mr-1.5 h-[14px] w-[14px]" />
              <span>Add URL</span>
            </div>
          </XWDropdownItem>
        </XWDropdownContent>
      </XWDropdown>
    </>
  );
}
