import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import AddFileDropdown from "./AddFileDropdown";
import ChatSonicSelectCharacter from "./ChatSonicSelectCharacter";
import { Button } from "~/components/ui/button";
import { AudioLines, ImageIcon, Loader2, Paperclip, Send } from "lucide-react";
import UrlInput from "./UrlInput";
import Image from "next/image";
import { X } from "lucide-react";
import { trpc } from "~/trpc/react";
import { useSessionId } from "~/hooks/chatsonic/useSessionId";
import useChatExist from "~/hooks/chatsonic/useChatExist";
import AddDoc from "~/icons/AddDoc";
import { OpenSections, UploadedFile } from "~/types/chatsonic.types";
import { useUser } from "~/hooks/misc/useUser";
import { useXWAlert } from "~/components/reusable/xw-alert";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

const MAX_FILES = 3;

interface ChatSonicChatInputProps {
  setOpenSections: React.Dispatch<React.SetStateAction<OpenSections>>;
  setMode: React.Dispatch<React.SetStateAction<"Normal" | "Docs" | "Web">>;
  handleSend: () => void;
  isGeneratingResponse: boolean;
  urls: string[];
  setUrls: React.Dispatch<React.SetStateAction<string[]>>;
  fileIds: { id: string; filename: string }[];
  setFileIds: React.Dispatch<
    React.SetStateAction<{ id: string; filename: string }[]>
  >;
  otherFiles: { id: string; mimeType: string }[];
  setOtherFiles: React.Dispatch<
    React.SetStateAction<{ id: string; mimeType: string }[]>
  >;
  selectedFiles: UploadedFile[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  selectedCharacter: string;
  setSelectedCharacter: React.Dispatch<React.SetStateAction<string>>;
  mode: "Normal" | "Docs" | "Web";
}

const ChatSonicChatInput = ({
  setOpenSections,
  setMode,
  handleSend,
  isGeneratingResponse,
  urls,
  setUrls,
  mode,
  fileIds,
  setFileIds,
  otherFiles,
  setOtherFiles,
  selectedFiles,
  setSelectedFiles,
  chatInput,
  setChatInput,
  selectedCharacter,
  setSelectedCharacter,
}: ChatSonicChatInputProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const hasTriedCreatingChat = useRef(false);
  const utils = trpc.useUtils();
  const { data: user } = useUser();

  const { mutate: updateLastPromptMutation } =
    trpc.chatsonic.updateLastPrompt.useMutation();
  const { data: avatars, isLoading: isLoadingAvatars } =
    trpc.chatsonic.getAvatars.useQuery();

  const isFileUploadDisabled = selectedFiles.length >= MAX_FILES;
  const isWebModeDisabled = selectedFiles.length > 0;

  const updateUrls = (newUrls: string[]) => {
    setUrls(newUrls);
  };
  const sessionId = useSessionId();
  const { showToast } = useXWAlert();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [chatInput]);

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  const handleModeChange = (selectedMode: "Normal" | "Docs" | "Web") => {
    if (selectedMode === "Web" && isWebModeDisabled) {
      showToast({
        title: "Warning",
        message: "Cannot switch to Web mode while documents are uploaded.",
        variant: "caution",
      });
      return;
    }
    setMode(selectedMode);
    if (sessionId) {
      updateLastPromptMutation({
        sessionId: sessionId,
        lastPromptPayload: JSON.stringify({
          mode: selectedMode,
          fileIds,
          otherFiles,
        }),
      });
    }
    if (selectedMode === "Web") {
      setOpenSections((prev) => ({
        ...prev,
        chats: false,
        publishDate: true,
        categories: true,
        domains: true,
      }));
    }
    if (selectedMode === "Normal")
      setOpenSections((prev) => ({ ...prev, chats: true }));
  };

  const {
    data: isChatExist,
    isLoading: isChatExistLoading,
    isError: chatExistError,
  } = useChatExist();

  const createChatMutation = trpc.chatsonic.createChat.useMutation({
    onSuccess: () => {
      utils.chatsonic.isChatActive.invalidate({ sessionId });
    },
  });

  useEffect(() => {
    const checkAndCreateChat = async () => {
      if (
        !hasTriedCreatingChat.current &&
        !isChatExist &&
        !isChatExistLoading &&
        !chatExistError &&
        !sessionId
      ) {
        hasTriedCreatingChat.current = true;
        const newSessionId = crypto.randomUUID();
        try {
          const existingChat = await utils.chatsonic.isChatActive.fetch({
            sessionId: newSessionId,
          });

          if (!existingChat) {
            await createChatMutation.mutateAsync({
              id: newSessionId,
              title: "New Chat",
              userId: user?.id ?? "",
              lastPromptPayload: JSON.stringify({ mode: "Normal" }),
            });
          }
        } catch (error) {
          console.error("Error creating chat:", error);
          hasTriedCreatingChat.current = false;
        }
      }
    };

    checkAndCreateChat();
  }, [
    sessionId,
    isChatExist,
    isChatExistLoading,
    chatExistError,
    user?.id,
    createChatMutation,
    utils.chatsonic.isChatActive,
  ]);

  const handleChatInput = useCallback(
    (value: string) => {
      setChatInput(value);
      if (isDisabled) setIsDisabled(false);
    },
    [isDisabled, setChatInput],
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = useCallback(
    (type: "document" | "image" | "audio", file: UploadedFile) => {
      if (isFileUploadDisabled) {
        showToast({
          title: "Warning",
          message: "You can only upload up to 3 files.",
          variant: "caution",
        });
        return;
      }

      setSelectedFiles((prev) => [...prev, file]);
      if (type === "document") {
        setFileIds((prev) => [
          ...prev,
          { id: file.id, filename: file.originalFileName },
        ]);
      } else {
        setOtherFiles((prev) => [
          ...prev,
          { id: file.id, mimeType: file.mimeType },
        ]);
      }
      setMode("Docs");
    },
    [
      isFileUploadDisabled,
      setFileIds,
      setOtherFiles,
      setMode,
      showToast,
      setSelectedFiles,
    ],
  );

  const handleFileRemove = useCallback(
    (fileId: string) => {
      setSelectedFiles((prev) => prev.filter((file) => file.id !== fileId));
      setFileIds((prev) => prev.filter((file) => file.id !== fileId));
      setOtherFiles((prev) => prev.filter((file) => file.id !== fileId));

      // If no files remain, switch back to NORMAL mode
      if (selectedFiles.length === 1) {
        setMode("Normal");
      }
    },
    [
      selectedFiles.length,
      setSelectedFiles,
      setFileIds,
      setOtherFiles,
      setMode,
    ],
  );

  // Determine the icon based on the file type
  const getFileIcon = (type: "document" | "image" | "audio") => {
    switch (type) {
      case "document":
        return <AddDoc className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "audio":
        return <AudioLines className="h-4 w-4" />;
      default:
        return <Paperclip className="h-4 w-4" />;
    }
  };

  // Truncate file name if too long
  const truncateFileName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + "...";
  };

  return (
    <div className="border-xw-border bg-xw-card rounded-lg border p-5">
      <textarea
        ref={inputRef}
        value={chatInput}
        onChange={(e) => handleChatInput(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isGeneratingResponse}
        placeholder="Ask me anything..."
        className="scrollbar-none scrollbar-track-inherit w-full resize-none overflow-auto border-none bg-transparent p-1 outline-none focus:ring-0"
        name="prompt"
        id=""
      ></textarea>
      {urls.length > 0 && <UrlInput urls={urls} setUrls={setUrls} />}
      {selectedFiles.length > 0 && (
        <div className="my-4 flex flex-wrap gap-2">
          {selectedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-xw-secondary flex items-center rounded-lg p-1"
            >
              <span className="max-w-xs truncate pl-1 text-xs text-white">
                {getFileIcon(file.type)}
              </span>
              <span className="max-w-xs truncate pl-1 text-xs text-white">
                {truncateFileName(file.originalFileName)}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleFileRemove(file.id)}
                className="text-red-500 hover:text-red-700"
                aria-label={`Remove ${file.originalFileName}`}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AddFileDropdown
            urls={urls}
            updateUrls={updateUrls}
            onFileSelect={handleFileSelect}
            isFileUploadDisabled={isFileUploadDisabled}
          />
          <ChatSonicSelectCharacter
            avatars={avatars}
            isLoading={isLoadingAvatars}
            selectedCharacter={selectedCharacter}
            setSelectedCharacter={setSelectedCharacter}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="border-xw-border bg-xw-background flex items-center gap-1 rounded-lg border p-[2px]">
            {/* <Button
                            size={"xs"}
                            variant={"xw_ghost"}
                            className={` px-2 gap-2 rounded-md text-xs ${mode === "Normal" ? "bg-xw-secondary text-white" : " bg-transparent"}`}
                            onClick={() => handleModeChange("Normal")}
                        >
                            <Image
                                src={"/icons/chatoval.svg"}
                                alt="Normal"
                                width={16}
                                height={16}
                            />
                            Normal Mode
                        </Button> */}

            <Button
              size={"sm"}
              variant={"ghost"}
              className={`gap-2 rounded-md px-2 text-xs ${mode === "Web" ? "bg-xw-secondary text-blue-500" : "bg-transparent text-white"}`}
              onClick={() =>
                mode === "Web"
                  ? handleModeChange("Normal")
                  : handleModeChange("Web")
              }
              disabled={isWebModeDisabled}
              title={
                isWebModeDisabled
                  ? "Disable WEB mode while documents are uploaded"
                  : "Switch to Web mode"
              }
            >
              <Image
                src={
                  mode === "Web"
                    ? "/icons/chatsonic/Web Mode Blue.svg"
                    : "/icons/chatsonic/Research Paper.svg"
                }
                alt="Research Paper"
                width={16}
                height={16}
              />
              Web Search
            </Button>
          </div>

          <Button
            size={"sm"}
            variant={"ghost"}
            onClick={handleSend}
            disabled={isGeneratingResponse || chatInput === ""}
          >
            {isGeneratingResponse ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSonicChatInput;
