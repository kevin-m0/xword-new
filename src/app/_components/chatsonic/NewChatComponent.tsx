"use client";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import ChatSonicSidebar from "./ChatSonicSidebar";
import ChatSonicChatbox from "./ChatSonicChatbox";
import { useCallback, useMemo, useState } from "react";
import ChatSonicChatInput from "./ChatSonicChatInput";
import { useSend } from "~/hooks/chatsonic/use-send";
import ChatSonicMobileSidebar from "./ChatSonicMobileSidebar";
import { useSessionWatcher } from "~/hooks/chatsonic/use-send/useSessionWatcher";
import { Message, UploadedFile } from "~/types/chatsonic.types";
import { trpc } from "~/trpc/react";
import { SonicChat } from "@prisma/client";

const NewChatComponent = ({
  sessionId,
  messages: initialMessages,
  chat,
  chats: initialChats,
}: {
  sessionId: string;
  messages: Message[];
  chat: any[];
  chats: SonicChat[];
}) => {
  const [mode, setMode] = useState<"Normal" | "Docs" | "Web">("Normal");
  const [selectedCharacter, setSelectedCharacter] = useState<string>("wizard");
  const [selectedCategory, setSelectedCategory] = useState<string>("None");
  const [selectedPublishDate, setSelectedPublishDate] =
    useState<string>("None");
  const [includeDomains, setIncludeDomains] = useState<string[]>([]);

  const [chats, setChats] = useState<SonicChat[]>(initialChats);
  const [messages, setMessages] = useState<any[]>(initialMessages);

  // Separate state for fileIds and otherFiles
  const [fileIds, setFileIds] = useState<{ id: string; filename: string }[]>(
    [],
  ); // For documents
  const [otherFiles, setOtherFiles] = useState<
    { id: string; mimeType: string }[]
  >([]); // For images/audio
  const [urls, setUrls] = useState<string[]>([]);
  useSessionWatcher(sessionId);

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

  const { handleSend } = useSend(
    useMemo(
      () => ({
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
        includeDomains,
        avatarId: selectedCharacter,
        messages,
        setMessages,
        setChats,
      }),
      [
        chatInput,
        fileIds,
        otherFiles,
        sessionId,
        urls,
        mode,
        selectedCategory,
        selectedPublishDate,
        includeDomains,
        selectedCharacter,
        messages,
        chats,
      ],
    ),
  );

  return (
    <div className="flex h-[calc(100dvh-1rem)] overflow-hidden">
      <div className="hidden bg-xw-sidebar md:flex">
        <ScrollArea>
          <ChatSonicSidebar
            key={sessionId}
            openSections={openSections}
            setOpenSections={setOpenSections}
            mode={mode}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPublishDate={selectedPublishDate}
            setSelectedPublishDate={setSelectedPublishDate}
            includeDomains={includeDomains}
            setIncludeDomains={setIncludeDomains}
            sessionId={sessionId}
            chats={chats}
          />
          <ScrollBar />
        </ScrollArea>
      </div>

      <div className="flex h-full w-full flex-1 flex-col">
        <ChatSonicMobileSidebar
          sidebar={
            <ChatSonicSidebar
              key={sessionId}
              openSections={openSections}
              setOpenSections={setOpenSections}
              mode={mode}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPublishDate={selectedPublishDate}
              setSelectedPublishDate={setSelectedPublishDate}
              includeDomains={includeDomains}
              setIncludeDomains={setIncludeDomains}
              sessionId={sessionId}
              chats={chats as any[]}
            />
          }
        />
        <div className="scrollbar-track-transparent scrollbar-thumb-xw-secondary scrollbar-thin mx-auto flex w-full flex-1 flex-col overflow-y-auto px-5 py-5">
          <ChatSonicChatbox
            mode={mode}
            messages={messages}
            setChatInput={setChatInput}
          />
        </div>

        <div className="mx-auto w-full max-w-3xl">
          <ChatSonicChatInput
            setOpenSections={setOpenSections}
            setMode={setMode}
            handleSend={handleSend}
            sessionId={sessionId}
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

export default NewChatComponent;
