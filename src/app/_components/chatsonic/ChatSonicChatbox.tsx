"use client";

import { ScrollArea } from "~/components/ui/scroll-area";
import React, { useEffect, useMemo, useRef } from "react";
import { cn } from "~/utils/utils";
import ChatSonicDefaultScreen from "./ChatSonicDefaultScreen";
import ChatPrompt from "./ChatPrompt";
import ChatResponse from "./ChatResponse";
import { useAtomValue } from "jotai";
import useMeasure from "~/hooks/misc/useMeasure";
import { useSessionId } from "~/hooks/chatsonic/useSessionId";
import { useUser } from "~/hooks/misc/useUser";
import { isGeneratingResponseAtom } from "~/atoms";
import { trpc } from "~/trpc/react";
import useChatExist from "~/hooks/chatsonic/useChatExist";
import { Message, Roles } from "~/types/chatsonic.types";
import { useSend } from "~/hooks/chatsonic/use-send";
import LoaderCircle from "~/icons/LoaderCircle";

interface ChatSonicChatboxProps {
  mode: "Normal" | "Docs" | "Web";
  setChatInput: (props: string) => void;
}

const ChatSonicChatbox: React.FC<ChatSonicChatboxProps> = ({
  mode,
  setChatInput,
}) => {
  const [ref, { height }] = useMeasure();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const sessionId = useSessionId();
  const { data: user } = useUser();
  const isGeneratingResponse = useAtomValue(isGeneratingResponseAtom);
  const utils = trpc.useUtils();

  const { data: isChatExist, isLoading: isChatExistLoading } = useChatExist();

  const {
    data: messages,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = trpc.chatsonic.fetchAllMessages.useQuery(
    { sessionId },
    {
      enabled: !!sessionId,
      refetchOnWindowFocus: false,
      refetchInterval: isGeneratingResponse ? 2000 : false,
      staleTime: 0,
    },
  );

  useEffect(() => {
    if (messages?.length && messages?.length > 0 && !isChatExist) {
      utils.chatsonic.isChatActive.invalidate({ sessionId });
    }
  }, [messages, isChatExist, sessionId, utils.chatsonic.isChatActive]);

  useEffect(() => {
    if (isChatExist) {
      refetchMessages();
    }
  }, [isChatExist, refetchMessages]);

  const { data: lastPromptPayload } = trpc.chatsonic.lastPromptPayload.useQuery(
    {
      sessionId,
    },
  );

  const uniqueMessages = useMemo(() => {
    return (
      messages?.reduce<Message[]>((acc, current) => {
        const exists = acc.find((item) => item.id === current.id);
        if (!exists) {
          const message: Message = {
            ...current,
            sources: current.sources ? JSON.parse(current.sources) : undefined,
          };
          return [...acc, message];
        }
        return acc;
      }, []) ?? []
    );
  }, [messages]);

  const lastMessage = useMemo(() => messages?.at(-1), [messages]);

  const useSendOptions = useMemo(() => {
    const lastPrompt = lastPromptPayload as string;
    const parsedLastPrompt = lastPrompt && JSON.parse(lastPrompt);
    return {
      ...parsedLastPrompt,
      sessionData: { id: sessionId, userId: user?.id, token: null },
    };
  }, [lastPromptPayload, sessionId, user?.id]);

  const { handleSend: handleRegenerate, isGeneratingResponse: isRegenerating } =
    useSend(useSendOptions);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isChatExistLoading || messagesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle className="size-11 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden">
      {(!isChatExist || !messages?.length) && (
        <div className="chatsonic-welcome-bg absolute top-0 w-full rounded-xl blur-lg" />
      )}

      {isChatExist && messages?.length && messages?.length > 0 ? (
        <ScrollArea
          className={cn(
            "relative z-10 flex h-full w-full flex-col gap-2",
            "mx-auto",
            "max-w-2xl sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl",
            "px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-64",
          )}
        >
          {uniqueMessages?.map((message: Message) => {
            const key = `${message.id}-${message.role}`;
            if (message.role === Roles.User) {
              return (
                <ChatPrompt
                  key={key}
                  prompt={message}
                  nameInitial={user?.name?.[0] ?? "U"}
                  userImageSrc={user?.image || ""}
                />
              );
            } else if (message.role === Roles.AI) {
              return (
                <ChatResponse
                  key={key}
                  message={message}
                  isLastResponse={
                    message.id === messages[messages.length - 1]?.id
                  }
                  handleRegenerate={handleRegenerate}
                  isRegenarating={isRegenerating}
                  userId={user?.id}
                />
              );
            }
            return null;
          })}
          <div ref={bottomRef} />
        </ScrollArea>
      ) : (
        <ChatSonicDefaultScreen mode={mode} setChatInput={setChatInput} />
      )}
    </div>
  );
};

export default ChatSonicChatbox;
