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
import { useUser } from "@clerk/nextjs";
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
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const sessionId = useSessionId();
  const { user } = useUser();
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
      enabled: isChatExist === true && !!sessionId,
      refetchOnWindowFocus: false,
      refetchInterval: isGeneratingResponse ? 1000 : false || 0,
      staleTime: 0,
    },
  );

  const lastMessage = useMemo(() => messages?.at(-1), [messages]);

  useEffect(() => {
    console.log(messages?.length, "message length");
    if (messages?.length && messages?.length > 0 && !isChatExist) {
      utils.chatsonic.isChatActive.invalidate({ sessionId });
    }
  }, [messages, isChatExist, sessionId, utils.chatsonic.isChatActive]);

  const { data: lastPromptPayload } = trpc.chatsonic.lastPromptPayload.useQuery(
    {
      sessionId,
    },
    { enabled: isChatExist === true },
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

  useEffect(() => {
    if (sessionId) {
      refetchMessages();
    }
  }, [isChatExist, refetchMessages, isGeneratingResponse]);

  const useSendOptions = useMemo(() => {
    const lastPrompt = lastPromptPayload as string;
    const parsedLastPrompt = lastPrompt && JSON.parse(lastPrompt);
    return {
      ...parsedLastPrompt,
      sessionData: { id: sessionId, userId: user?.id, token: null },
    };
  }, [lastPromptPayload, sessionId, user?.id]);

  const { handleSend: handleRegenerate } = useSend(useSendOptions);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // DEBUGGING
  console.log("isgenreatingresponse", isGeneratingResponse);
  // END DEBUGGING

  return (
    <div className="relative mx-auto flex max-w-4xl flex-col overflow-hidden">
      {(!isChatExist || !messages?.length) && (
        <div className="chatsonic-welcome-bg absolute top-0 w-full rounded-xl bg-red-600 blur-lg" />
      )}

      {isChatExist && messages?.length && messages?.length > 0 ? (
        <ScrollArea
          className={cn(
            "relative z-10 flex h-full w-full flex-col gap-2",
            "mx-auto sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl",
          )}
        >
          {uniqueMessages?.map((message: Message) => {
            const key = `${message.id}-${message.role}`;
            if (message.role === Roles.User) {
              return (
                <ChatPrompt
                  key={key}
                  prompt={message}
                  nameInitial={user?.firstName?.[0] ?? "U"}
                  userImageSrc={user?.imageUrl || ""}
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
                  isRegenarating={isGeneratingResponse}
                  userId={user?.id}
                />
              );
            }
            return null;
          })}
          {isGeneratingResponse && (
            <div className="my-2 ml-4 flex animate-pulse items-center space-x-2 text-gray-400">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.6s]"></span>
            </div>
          )}
          <div ref={bottomRef} />
        </ScrollArea>
      ) : (
        <ChatSonicDefaultScreen mode={mode} setChatInput={setChatInput} />
      )}
    </div>
  );
};

export default ChatSonicChatbox;
