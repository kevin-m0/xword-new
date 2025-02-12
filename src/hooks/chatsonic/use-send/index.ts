import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import useSendMessageDb from "./useSendMessageDb";
import { useAtom, useAtomValue } from "jotai";
import axios from "axios";
import { useUser } from "../../misc/useUser";
import { trpc } from "~/trpc/react";
import { UseSend } from "~/types/chatsonic.types";
import { brandVoiceAtom } from "~/atoms";

export const useSend = ({
  fileIds,
  otherFiles,
  chatInput,
  sessionId,
  isChatExist,
  clearInput,
  urls,
  avatarId,
  mode,
  category,
  publishDate,
  includeDomains,
}: UseSend) => {
  const utils = trpc.useUtils();
  const { data: user } = useUser();
  const createAssetMutation = trpc.image.createAssets.useMutation();
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  const { mutateAsync: sendUserMessageToDb } = useSendMessageDb(
    isChatExist,
    false
  );

  const { mutate: sendAIMessage } = useSendMessageDb(isChatExist, true);

  const updatePersonalDataMutation =
    trpc.chatsonic.updatePersonalData.useMutation();

  const { mutate: updateLastPromptMutation } =
    trpc.chatsonic.updateLastPrompt.useMutation();


  const createChatMutation = trpc.chatsonic.createChat.useMutation({
    onSuccess: () => {
      utils.chatsonic.isChatActive.invalidate({ sessionId });
    },
  });

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

  const previousSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    if (sessionId !== previousSessionRef.current) {
      console.log(
        "⚡️ useEffect: sessionId changed from",
        previousSessionRef.current,
        "to",
        sessionId
      );

      if (previousSessionRef.current) {
        const oldSession = previousSessionRef.current;
        console.log(
          "🔶 Calling updatePersonalData for old session:",
          oldSession
        );
        updatePersonalDataMutation.mutate({
          userId: user?.id ?? "",
          sessionId: oldSession,
        });
      }

      previousSessionRef.current = sessionId;
    }
  }, [sessionId, updatePersonalDataMutation, user?.id]);

  const getPreviousMessages = () => {
    const prevMessages =
      utils.chatsonic.fetchAllMessages.getData({ sessionId }) || [];
    return prevMessages
      .filter((message: any) => message.role && message.content)
      .map((message: any) => [message.role, message.content]);
  };

  const handleSend = async () => {
    if (!user?.id || !sessionId) return;

    const firstMessage = !isChatExist;
    const newTitle = firstMessage
      ? chatInput.length > 30
        ? `${chatInput.slice(0, 30)}...`
        : chatInput
      : "Untitled";

    try {
      // Create chat row if not present
      if (firstMessage) {
        await createChatMutation.mutateAsync({
          id: sessionId,
          title: newTitle,
          userId: user.id,
          lastPromptPayload: JSON.stringify({
            query: chatInput,
            mode,
            category,
            publishDate,
            includeDomains,
            fileIds,
            otherFiles,
            urls,
          }),
        });
      }

      setIsGeneratingResponse(true);
      // const lastMessagePair =
      //   messages.length >= 2
      //     ? messages.slice(-2).filter((msg) => msg[1] !== null)
      //     : [];
      const messages = getPreviousMessages();
      const lastMessages =
        messages.length >= 2
          ? messages.slice(-2).filter((msg) => msg[1] !== null)
          : [];

      const userMessageId = crypto.randomUUID();
      const newUserMessage = {
        id: userMessageId,
        userId: user.id as string,
        sessionId,
        avatarId,
        brandVoice: mergedBrandVoice,
        // lastMessages: lastMessagePair.map((msg) => JSON.stringify(msg)),
        lastMessages: lastMessages.map((msg) => JSON.stringify(msg)),
        mode,
        fileIds,
        category,
        publishDate,
        includeDomains,
        otherFiles: otherFiles,
        Urls: urls || [],
        query: chatInput,
        role: "user" as const,
      };
      
      console.log({
        sessionId: sessionId,
        lastPromptPayload: JSON.stringify(newUserMessage),
      });

      // if (chatInput.trim().length > 0) {
      //   updateLastPromptMutation({
      //     sessionId: sessionId,
      //     lastPromptPayload: JSON.stringify(newUserMessage),
      //   });
      // }

      await sendUserMessageToDb(newUserMessage);

      clearInput?.();

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/chatbot/longterm-chatbot`,
        newUserMessage,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.response) {
        const aiMessage = {
          id: crypto.randomUUID(),
          avatarId,
          query: res.data.response,
          userId: user.id,
          brandVoice: mergedBrandVoice,
          sessionId: sessionId,
          // lastMessages: lastMessagePair.map((msg) => JSON.stringify(msg)),
          lastMessages: lastMessages.map((msg) => JSON.stringify(msg)),
          mode,
          fileIds,
          otherFiles,
          Urls: urls || [],
          category,
          publishDate,
          includeDomains,
          role: "ai" as const,
          sources: res.data.sources
            ? JSON.stringify(res.data.sources)
            : undefined,
        };
        console.log("aiMessage: ", aiMessage);

        sendAIMessage(aiMessage);

        if (res.data.image) {
          await createAssetMutation.mutateAsync({
            workspaceId: "",
            assets: [
              {
                imageKey: res.data.image,
                prompt: chatInput || "Generated Image",
              },
            ],
          });
        }
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  return {
    handleSend,
    isGeneratingResponse,
  };
};
