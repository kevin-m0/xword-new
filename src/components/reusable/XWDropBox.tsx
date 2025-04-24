"use client";

import React, { useState, useCallback, useEffect } from "react";
import Dropzone from "react-dropzone";
import { Download, Upload, CheckCircle, Loader2, Trash } from "lucide-react";
import { useXWAlert } from "../reusable/xw-alert";
import { Button } from "../ui/button";

interface XWDropBoxProps {
  title: string;
  acceptTypes: Record<string, string[]>;
  description?: string;
  value?: File | null;
  onFileChange?: (file: File | null) => void;
  onDrop?: (acceptedFiles: File[]) => void;
  validateFile?: (file: File) => boolean | string;
  replacable?: boolean;
  onRemove?: () => void;
}

const XWDropBox: React.FC<XWDropBoxProps> = ({
  title,
  acceptTypes,
  description,
  value,
  onFileChange,
  onDrop,
  validateFile,
  replacable = true,
  onRemove,
}) => {
  const [localFile, setLocalFile] = useState<{
    file: File;
    isUploading: boolean;
  } | null>(value ? { file: value, isUploading: false } : null);
  const { showToast } = useXWAlert();

  useEffect(() => {
    if (value !== undefined) {
      setLocalFile(value ? { file: value, isUploading: false } : null);
    }
  }, [value]);

  const handleOnDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      if (validateFile) {
        const validation = validateFile(file as File);
        if (validation !== true) {
          showToast({
            title: "Validation Failed",
            message:
              typeof validation === "string" ? validation : "Invalid file.",
            variant: "error",
          });
          return;
        }
      }

      try {
        setLocalFile({ file: file as File, isUploading: true });
        onDrop?.(acceptedFiles);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLocalFile({ file: file as File, isUploading: false });
        onFileChange?.(file as File);
      } catch (error) {
        console.error("Upload error:", error);
        setLocalFile(null);
        onFileChange?.(null);
        showToast({
          title: "Upload Failed",
          message: "There was an error uploading your file.",
          variant: "error",
        });
      }
    },
    [onDrop, onFileChange, validateFile, showToast],
  );

  const removeFile = () => {
    setLocalFile(null);
    onFileChange?.(null);
    onRemove?.();
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      <Dropzone onDrop={handleOnDrop} accept={acceptTypes} multiple={false}>
        {({ getRootProps, getInputProps }) => (
          <div
            className="border-xw-secondary bg-xw-background flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-10"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div className="flex w-full flex-col items-center justify-center gap-4 p-5 text-center">
              <Download className="text-xw-secondary h-10 w-10" />
              <h1 className="text-2xl font-semibold">{title}</h1>
              <p className="text-xw-muted">{description}</p>

              {localFile && (
                <div className="flex flex-col items-center gap-2">
                  {localFile.isUploading ? (
                    <div className="text-xw-muted flex items-center gap-2">
                      <Loader2 className="text-xw-secondary h-5 w-5 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  ) : (
                    <div className="text-xw-muted-foreground flex items-center gap-2">
                      <CheckCircle className="text-xw-primary h-4 w-4" />
                      <span className="text-sm">{localFile.file.name}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2 flex items-center gap-4">
                <Button
                  variant="outline"
                  type="button"
                  disabled={localFile?.isUploading}
                >
                  {localFile?.isUploading ? "Uploading..." : "Upload File"}
                  <Upload className="ml-2 h-4 w-4" />
                </Button>

                {localFile && replacable && (
                  <>
                    <Button
                      onClick={removeFile}
                      variant="outline"
                      type="button"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default XWDropBox;
