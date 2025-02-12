import { useState, useMemo, useEffect } from "react";
import { trpc } from "~/trpc/react";
import { useAtom, useSetAtom } from "jotai";
import axios from "axios";
import { toast } from "sonner";
import { isGeneratingResponseAtom, brandVoiceAtom } from "@/atoms";
import useSendMessageDb from "./useSendMessageDb";
import { useUser } from "../../misc/useUser";
import { UseSend } from "@/app/(site)/(dashboard)/_types/chatsonic.types";

export const useSendMessage = ({
  fileIds,
  otherFiles,
  chatInput,
  isChatExist,
  sessionId,
  clearInput,
  avatarId,
  urls,
  mode,
  category,
  publishDate,
  includeDomains,
}: UseSend) => {
  const utils = trpc.useUtils();
  const { data: user } = useUser();
  const setIsGeneratingResponse = useSetAtom(isGeneratingResponseAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isExistingSession, setIsExistingSession] = useState(false);

  const defaultBrandVoice = {
    name: "",
    specialization: "",
    audience: "",
    purpose: "",
    tone: [],
    emotions: [],
    character: [],
    genre: [],
    languageStyle: [],
    brandVoice: "",
  };

  const [brandVoice] = useAtom<object | null>(brandVoiceAtom);
  const mergedBrandVoice = { ...defaultBrandVoice, ...brandVoice };

  const {
    mutateAsync: updatedMessageInDb,
    isLoading: isUpdatingMessageInDb,
    isError: isUpdatingMessageInDbError,
  } = useSendMessageDb(isChatExist, false);

  const getPreviousMessages = (): [string, string][] => {
    const prevMessages =
      utils.chatsonic.fetchAllMessages.getData({ sessionId: sessionId }) || [];
    return prevMessages.map((message: any) => [message.role, message.content]);
  };

  const files = useMemo(() => fileIds?.map((file) => file) || [], [fileIds]);

  const otherFilesObj = useMemo(
    () => ({
      files:
        otherFiles?.files?.map((file) => ({
          id: file.id,
          mimeType: file.mimeType || "",
        })) || [],
    }),
    [otherFiles],
  );

  const trimmedUrls = useMemo(() => urls?.map((url) => url) || [], [urls]);

  useEffect(() => {
    const checkExistingSession = async () => {
      if (sessionId) {
        const existingMessages = await utils.chatsonic.fetchAllMessages.fetch({
          sessionId: sessionId,
        });
        setIsExistingSession(existingMessages && existingMessages.length > 0);
      }
    };
    checkExistingSession();
  }, [sessionId, utils.chatsonic.fetchAllMessages]);

  const handleSend = async () => {
    setIsGeneratingResponse(true);
    setIsLoading(true);
    setIsError(false);

    const messages = getPreviousMessages();
    const lastMessage = messages.slice(-2);

    const newUserMessage = {
      id: crypto.randomUUID(),
      userId: user?.id ?? "",
      sessionId: sessionId,
      avatarId,
      brandVoice: mergedBrandVoice,
      lastMessages: lastMessage.map(([_, content]) => content),
      mode,
      fileIds: files,
      category,
      publishDate,
      includeDomains,
      otherFiles: otherFilesObj,
      Urls: trimmedUrls,
      query: chatInput,
      role: "user" as const,
    };

    try {
      // if (isExistingSession) {
      //   // Call updatePersonalData only for existing sessions
      //   await updatePersonalDataMutation.mutateAsync({
      //     userId: user?.id ?? '',
      //     sessionId: sessionId,
      //   });
      // }

      await updatedMessageInDb(newUserMessage);
      clearInput?.();

      const url = `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/chatbot/longterm-chatbot`;
      const config = {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(url, newUserMessage, config);

      if (res.data && res.data.response) {
        await updatedMessageInDb({
          ...newUserMessage,
          query: res.data.response,
          role: "ai" as const,
        });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      setIsError(true);
      console.error("Error in handleSend:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsGeneratingResponse(false);
      setIsLoading(false);
    }
  };

  return {
    handleSend,
    isLoading,
    isError,
  };
};

export default useSendMessage;
