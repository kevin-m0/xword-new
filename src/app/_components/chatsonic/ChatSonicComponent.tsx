"use client";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import ChatSonicSidebar from "./ChatSonicSidebar";
import ChatSonicChatbox from "./ChatSonicChatbox";
import ChatSonicTopbar from "./ChatSonicTopbar";
import { useCallback, useState } from "react";
import ChatSonicChatInput from "./ChatSonicChatInput";
import { useSend } from "~/hooks/chatsonic/use-send";
import ChatSonicMobileSidebar from "./ChatSonicMobileSidebar";
import { useSessionId } from "~/hooks/chatsonic/useSessionId";
import { useSessionWatcher } from "~/hooks/chatsonic/use-send/useSessionWatcher";
import { UploadedFile } from "~/types/chatsonic.types";

const ChatSonicComponent = () => {
  const [mode, setMode] = useState<"Normal" | "Docs" | "Web">("Normal");
  const [selectedCharacter, setSelectedCharacter] = useState<string>("wizard");
  const [selectedCategory, setSelectedCategory] = useState<string>("None");
  const [selectedPublishDate, setSelectedPublishDate] =
    useState<string>("None");
  const [includeDomains, setIncludeDomains] = useState<string[]>([]);

  // Separate state for fileIds and otherFiles
  const [fileIds, setFileIds] = useState<{ id: string; filename: string }[]>(
    [],
  ); // For documents
  const [otherFiles, setOtherFiles] = useState<
    { id: string; mimeType: string }[]
  >([]); // For images/audio
  const [urls, setUrls] = useState<string[]>([]);
  const sessionId = useSessionId();
  useSessionWatcher(sessionId);

  // New state to track selected files
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);

  const [openSections, setOpenSections] = useState({
    chats: true,
    publishDate: false,
    categories: false,
    domains: false,
  });
  const [chatInput, setChatInput] = useState<string>("");

  const clearInput = useCallback(() => {
    setChatInput("");
    setFileIds([]);
    setOtherFiles([]);
    setSelectedFiles([]);
    setUrls([]);
  }, []);

  const { handleSend, isGeneratingResponse } = useSend({
    isChatExist: true,
    chatInput,
    fileIds,
    otherFiles: { files: otherFiles },
    sessionId,
    clearInput,
    urls,
    mode,
    category: selectedCategory,
    publishDate: selectedPublishDate,
    includeDomains: includeDomains,
    avatarId: selectedCharacter,
  });

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <div className="bg-xw-sidebar hidden w-full max-w-xs md:flex">
        <ScrollArea className="w-full">
          <ChatSonicSidebar
            openSections={openSections}
            setOpenSections={setOpenSections}
            mode={mode}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPublishDate={selectedPublishDate}
            setSelectedPublishDate={setSelectedPublishDate}
            includeDomains={includeDomains}
            setIncludeDomains={setIncludeDomains}
          />
          <ScrollBar />
        </ScrollArea>
      </div>

      <div className="flex h-full w-full flex-1 flex-col">
        <ChatSonicMobileSidebar
          sidebar={
            <ChatSonicSidebar
              openSections={openSections}
              setOpenSections={setOpenSections}
              mode={mode}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPublishDate={selectedPublishDate}
              setSelectedPublishDate={setSelectedPublishDate}
              includeDomains={includeDomains}
              setIncludeDomains={setIncludeDomains}
            />
          }
        />
        <div className="scrollbar-track-transparent scrollbar-thumb-xw-secondary scrollbar-thin mx-auto flex w-full flex-1 flex-col overflow-y-auto px-5 py-5">
          <ChatSonicChatbox mode={mode} setChatInput={setChatInput} />
        </div>

        <div className="mx-auto w-full max-w-3xl px-5 pb-5 pt-2">
          <ChatSonicChatInput
            setOpenSections={setOpenSections}
            setMode={setMode}
            handleSend={handleSend}
            isGeneratingResponse={isGeneratingResponse}
            urls={urls}
            setUrls={setUrls}
            mode={mode}
            fileIds={fileIds}
            setFileIds={setFileIds} // Existing
            otherFiles={otherFiles}
            setOtherFiles={setOtherFiles} // Existing
            selectedFiles={selectedFiles} // New
            setSelectedFiles={setSelectedFiles} // New
            chatInput={chatInput}
            setChatInput={setChatInput}
            selectedCharacter={selectedCharacter}
            setSelectedCharacter={setSelectedCharacter}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatSonicComponent;
