"use client";

import React, { useEffect, useMemo } from "react";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useCallback, useState } from "react";
import { useSend } from "~/hooks/chatsonic/use-send";
import { useSessionWatcher } from "~/hooks/chatsonic/use-send/useSessionWatcher";
import { UploadedFile } from "~/types/chatsonic.types";
import ChatSonicSidebar from "~/app/_components/chatsonic/ChatSonicSidebar";
import ChatSonicChatbox from "~/app/_components/chatsonic/ChatSonicChatbox";
import ChatSonicChatInput from "~/app/_components/chatsonic/ChatSonicChatInput";
import { useUser } from "@clerk/nextjs";

const Page = () => {
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

  const newSessionId = useMemo(() => crypto.randomUUID(), []);

  console.log("this is the new session id in /chatsonic", newSessionId);

  useSessionWatcher(newSessionId);

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
    isChatExist: false,
    chatInput,
    fileIds,
    otherFiles: { files: otherFiles },
    sessionId: newSessionId,
    clearInput,
    urls,
    mode,
    category: selectedCategory,
    publishDate: selectedPublishDate,
    includeDomains: includeDomains,
    avatarId: selectedCharacter,
  });

  return (
    <div className="flex h-[calc(100dvh-3rem)] w-full overflow-hidden">
      <div className="hidden w-full max-w-xs bg-xw-sidebar md:flex">
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

      <div className="flex flex-1 flex-col">
        <div className="scrollbar-track-transparent scrollbar-thumb-xw-secondary scrollbar-thin mx-auto flex w-full flex-1 flex-col overflow-y-auto px-5 pt-60">
          <ChatSonicChatbox mode={mode} setChatInput={setChatInput} />
        </div>

        <div className="mx-auto w-full max-w-3xl px-5">
          <ChatSonicChatInput
            setOpenSections={setOpenSections}
            setMode={setMode}
            handleSend={handleSend}
            sessionId={newSessionId}
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

export default Page;
