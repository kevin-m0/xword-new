import React, { forwardRef, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
// import { CustomTooltip } from "/components/ui/custom-tooltip";
import { cn } from "~/utils/utils";
import { trpc } from "~/trpc/react";
import { CustomTooltip } from "~/components/reusable/custom-tooltip";
import AudioBox from "../soundverse/AudioBox";

function handleFilePreview(fileUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

type FilePromptProps = {
  fileId: string;
  mimeType?: string;
};

const FilePrompt = forwardRef<HTMLDivElement, FilePromptProps>(function (
  { fileId, mimeType },
  ref,
) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    data: fileUrl,
    isLoading,
    isError,
  } = trpc.aws.getObjectURL.useQuery({ key: fileId });

  const isImage = mimeType?.startsWith("image/");
  const isAudio = mimeType?.startsWith("audio/");
  const isDoc =
    mimeType === "application/msword" ||
    mimeType === "application/pdf" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (isLoading) {
    if (isImage) {
      return <Skeleton className="h-52 w-48 rounded-[16px]" />;
    }
    if (isAudio) {
      return <Skeleton className="h-28 w-72 rounded-[16px]" />;
    }
    if (isDoc) {
      return <Skeleton className="w-68 h-12 rounded-[16px]" />;
    }
  }

  if (isError || !fileUrl) {
    return (
      <div className="h-48 w-36 rounded-[16px]">
        <div className="flex items-center justify-center text-red-500">
          Error Loading File
        </div>
      </div>
    );
  }

  let contentPreview = null;
  let containerClasses = "relative rounded-[16px] p-2 overflow-hidden";

  if (isImage) {
    containerClasses +=
      " w-48 h-52 figma-border flex items-center justify-center";
    contentPreview = (
      <div className="relative h-48 w-full">
        <Image
          src={fileUrl}
          alt="image"
          fill
          className="rounded-[16px] object-cover"
        />
      </div>
    );
  } else if (isAudio) {
    containerClasses +=
      " w-72 h-28 figma-border flex items-center justify-center";
    contentPreview = <AudioBox audioKey={fileId} hideMetadata={true} />;
  } else if (isDoc) {
    containerClasses += " w-72 h-8 flex justify-start items-start";
    contentPreview = (
      <div className="flex items-start justify-start gap-2">
        {/* <AddDoc className="h-16 w-16 text-blue-500" /> Document icon */}
        <span
          className="cursor-pointer text-blue-500 underline"
          onClick={() => window.open(fileUrl, "_blank")}
        >
          Click to View Document
        </span>
      </div>
    );
  } else {
    containerClasses += " w-36 h-36";
    contentPreview = (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        Open File
      </a>
    );
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(containerClasses)}
    >
      {contentPreview}

      {isImage && (
        <CustomTooltip text="Preview">
          <button
            onClick={() =>
              handleFilePreview(
                fileUrl,
                isDoc ? fileId.split("-").slice(1).join("-") : fileId,
              )
            }
            className={`absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-sm bg-white hover:bg-slate-200 ${
              isHovered ? "flex" : "hidden"
            }`}
          >
            <EyeIcon className="h-3 w-3 text-black" />
          </button>
        </CustomTooltip>
      )}
    </div>
  );
});

FilePrompt.displayName = "FilePrompt";

export default FilePrompt;
