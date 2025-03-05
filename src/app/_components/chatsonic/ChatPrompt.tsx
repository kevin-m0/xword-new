import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { motion } from "framer-motion";
import UrlPrompt from "./UrlPrompt";
import FilePrompt from "./FilePrompt";
import { RenderMarkdown } from "~/components/render-markdown/render-markdown";
import { Message, UploadedFile } from "~/types/chatsonic.types";

interface ChatPromptProps {
  prompt: Message;
  nameInitial: string;
  userImageSrc: string;
}

const ChatPrompt = ({ prompt, nameInitial, userImageSrc }: ChatPromptProps) => {
  const otherFilesObj =
    typeof prompt.otherFiles === "string"
      ? JSON.parse(prompt.otherFiles)
      : prompt.otherFiles;

  const fileIdsObj =
    typeof prompt.fileIds === "string"
      ? JSON.parse(prompt.fileIds)
      : prompt.fileIds;

  return (
    <div className="flex min-w-[800px] justify-end gap-4 py-4">
      <div className="mt-2 flex flex-col gap-2 rounded-full bg-gray-500 p-4 text-black">
        <div className="font-normal">
          <RenderMarkdown content={prompt.query} />
          {fileIdsObj && fileIdsObj.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-4">
              {fileIdsObj.map((file: UploadedFile) => (
                <FilePrompt
                  key={file.id}
                  fileId={file.id}
                  mimeType="application/pdf"
                />
              ))}
            </div>
          )}

          {otherFilesObj && otherFilesObj.files && (
            <div className="mt-2 flex flex-wrap gap-4">
              {otherFilesObj.files.map((file: UploadedFile) => (
                <FilePrompt
                  key={file.id}
                  fileId={file.id}
                  mimeType={file.mimeType}
                />
              ))}
            </div>
          )}
          {prompt.Urls && prompt.Urls.length > 0 && (
            <div className="mt-2 flex flex-col gap-3">
              {prompt.Urls.map((url) => (
                <UrlPrompt key={url} url={url} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPrompt;
