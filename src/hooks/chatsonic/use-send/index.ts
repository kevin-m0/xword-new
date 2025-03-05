import { useEffect, useRef } from "react";
import useSendMessageDb from "./useSendMessageDb";
import { useAtom, useAtomValue } from "jotai";
import axios from "axios";
import { trpc } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";
import { brandVoiceAtom, isGeneratingResponseAtom } from "~/atoms";
import { Message, UseSend } from "~/types/chatsonic.types";
import { SonicChat } from "@prisma/client";

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
  messages,
  setMessages,
  setChats,
}: UseSend) => {
  const utils = trpc.useUtils();
  const { user } = useUser();
  const createAssetMutation = trpc.image.createAssets.useMutation();
  const [, setIsGeneratingResponse] = useAtom(isGeneratingResponseAtom);

  const { mutateAsync: sendUserMessageToDb } =
    trpc.chatsonic.sendMessage.useMutation();

  // const { mutateAsync: sendUserMessageToDb } = useSendMessageDb(
  //   isChatExist,
  //   false,
  // );

  const { mutate: sendAIMessage } = useSendMessageDb(isChatExist, true);

  const updatePersonalDataMutation =
    trpc.chatsonic.updatePersonalData.useMutation();

  const createChatMutation = trpc.chatsonic.createChat.useMutation({
    onSuccess: () => {
      utils.chatsonic.isChatActive.invalidate({ sessionId });
    },
  });

  const [brandVoice] = useAtom(brandVoiceAtom);
  // const mergedBrandVoice = { ...defaultBrandVoice, ...brandVoice };

  const previousSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    if (sessionId !== previousSessionRef.current) {
      console.log(
        "⚡️ useEffect: sessionId changed from",
        previousSessionRef.current,
        "to",
        sessionId,
      );

      if (previousSessionRef.current) {
        const oldSession = previousSessionRef.current;
        console.log(
          "🔶 Calling updatePersonalData for old session:",
          oldSession,
        );
        updatePersonalDataMutation.mutate({
          userId: user?.id ?? "",
          sessionId: oldSession,
        });
      }

      previousSessionRef.current = sessionId;
    }
  }, [sessionId, updatePersonalDataMutation, user?.id]);

  const handleSend = async () => {
    if (!user?.id || !sessionId) return;

    const lastMessages =
      messages.length >= 2
        ? messages.slice(-2).filter((msg) => msg.query !== null)
        : [];

    const userMessageId = crypto.randomUUID();
    const newUserMessage = {
      id: userMessageId,
      userId: user.id,
      sessionId,
      avatarId,
      brandVoice,
      lastMessages: lastMessages.map((msg) => JSON.stringify(msg)),
      mode,
      fileIds:
        fileIds
          .filter(
            (file): file is { id: string; filename: string } =>
              file !== null &&
              typeof file === "object" &&
              "id" in file &&
              "filename" in file,
          )
          .map((file) => ({ id: file.id, filename: file.filename })) ?? [],
      category,
      publishDate,
      includeDomains,
      otherFiles,
      Urls: urls || [],
      query: chatInput,
      role: "user" as const,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    let responseMessage =
      "Sorry, your response could not be generated. Please try again.";
    let sources = "";

    try {
      setIsGeneratingResponse(true);

      // API Request
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/chatbot/longterm-chatbot`,
        newUserMessage,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      sendUserMessageToDb(newUserMessage);

      if (res.data?.response) {
        responseMessage = res.data.response;
        sources = res.data.sources ? JSON.stringify(res.data.sources) : "";
      }

      // If API request fails or response is empty, it still gracefully continues
    } catch (error) {
      console.error("Error while fetching chatbot response:", error);
    }

    // Prepare AI Message
    const aiMessage = {
      id: crypto.randomUUID(),
      avatarId,
      query: responseMessage,
      userId: user.id,
      brandVoice,
      sessionId,
      lastMessages: lastMessages.map((msg) => JSON.stringify(msg)),
      mode,
      fileIds,
      otherFiles,
      Urls: urls || [],
      category,
      publishDate,
      includeDomains,
      role: "ai" as const,
      sources,
    };

    setMessages((prev) => [...prev, aiMessage]);
    sendAIMessage(aiMessage);

    try {
      const firstMessage = !isChatExist;

      const newTitle = firstMessage
        ? chatInput.length > 30
          ? `${chatInput.slice(0, 30)}...`
          : chatInput
        : "Untitled";

      const newChat: SonicChat = {
        id: sessionId,
        title: newTitle,
        userId: user.id,
        lastPromptPayload: JSON.stringify({
          query: chatInput.trim(),
          mode,
          category,
          publishDate,
          includeDomains,
          fileIds,
          otherFiles,
          urls,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create chat row if not present
      if (firstMessage) {
        await createChatMutation.mutateAsync({
          id: sessionId,
          title: newTitle,
          userId: user.id,
          lastPromptPayload: JSON.stringify({
            query: chatInput.trim(),
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

      setChats((prevChats) => [...prevChats, newChat]);
    } catch (error) {
      console.error("Error while saving chat to DB:", error);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  return {
    handleSend,
  };
};
