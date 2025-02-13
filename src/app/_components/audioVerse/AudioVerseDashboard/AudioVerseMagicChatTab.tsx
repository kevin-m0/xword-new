"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { BookOpen, Copy, RefreshCcw, Send, Volume2Icon } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useUser } from "@clerk/nextjs";
import { MESSAGES_LIMIT_CHAT } from "~/lib/constant/constants";
import { trpc } from "~/trpc/react";
import { useDocumentId } from "~/hooks/editor/useDocumentId";
import useAudioChatExist from "~/hooks/chatsonic/useAudioChatExist";
import useMeasure from "~/hooks/misc/useMeasure";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import MessageInput from "./MessageInput";
import SingleMessage from "../../writerx/flow/chat-tab/SingleMessage";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
}

const AudioVerseMagicChatTab = ({ audioProject }: { audioProject: any }) => {
  const [showChat, setShowChat] = useState(false);
  const documentId = useDocumentId();
  const [ref, { height }] = useMeasure();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    trpc.llm.fetchChatsGivenRecId.useInfiniteQuery(
      {
        limit: MESSAGES_LIMIT_CHAT,
        id: documentId as string,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // initialCursor: 1, // <-- optional you can pass an initialCursor
      },
    );

  const messages = useMemo(() => {
    return data?.pages.flatMap((page) => page.chats) || [];
  }, [data]);

  const { data: isChatExist, isLoading: isChatExistLoading } =
    useAudioChatExist(audioProject.id);

  console.log(isChatExist, "isChatExist");

  const loadMoreMessages = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const dropToKeyboard = () => {
    console.log("dropToKeyboard");
  };

  if (isChatExistLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-full max-h-[600px] flex-1 flex-col overflow-hidden">
      {!isChatExist ? (
        <div className="relative z-50 flex h-full w-full flex-col gap-0 px-10">
          <>
            <DefaultView />

            <div className="absolute bottom-0 left-0 right-0 z-10 mx-auto w-[calc(100%-24px)]">
              <MessageInput
                context={audioProject?.transcript || ""}
                messages={messages}
              />
            </div>
          </>
        </div>
      ) : (
        <div className="relative z-10 flex h-[500px] w-full flex-col justify-between px-10">
          <ScrollArea className="flex-1 flex-col overflow-y-auto">
            {messages
              .slice()
              .reverse()
              .map((msg) => (
                <SingleMessage
                  dropToKeyboard={dropToKeyboard}
                  key={msg.id}
                  msg={{
                    content: msg.content,
                    created: msg.createdAt as any as string,
                    id: msg.id,
                    role: msg.role,
                    userId: user?.id as string,
                  }}
                />
              ))}
            <div ref={bottomRef}></div>
          </ScrollArea>
          <div className="mt-4 flex-none">
            <MessageInput
              context={audioProject?.transcript || ""}
              messages={messages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const DefaultView = () => (
  <div className="flex flex-col items-center justify-center gap-6 pb-32 pt-12">
    <Image src="/icons/chatmagic.svg" height={30} width={30} alt="chat" />
    <div className="text-center">
      <h1 className="text-4xl font-medium">
        Hello, <span className="text-xw-primary">Kevin Roy</span>
      </h1>
      <p className="text-xw-muted-foreground mt-2">How can I help you today?</p>
    </div>
    <SuggestedPrompts />
  </div>
);

const SuggestedPrompts = () => (
  <div className="text-center">
    <h2 className="text-xw-muted mb-4 text-sm">Ask About:</h2>
    <div className="flex w-full max-w-lg flex-wrap justify-center gap-2">
      {[
        "Summarize this recording",
        "What is this recording about?",
        "What did they say about the new project?",
        "What are some life lessons from this recording?",
      ].map((prompt, i) => (
        <XWSecondaryButton
          key={i}
          className2="text-xs xw-premium-div"
          rounded="full"
        >
          {prompt}
        </XWSecondaryButton>
      ))}
      <Button variant="ghost" className="h-9 rounded-full text-sm">
        <BookOpen className="mr-2 h-4 w-4" /> See prompt library
      </Button>
    </div>
  </div>
);

const MessageBubble = ({ message }: { message: ChatMessage }) => (
  <div className="flex gap-3">
    <Avatar>
      <AvatarImage
        src={
          message.sender === "user"
            ? "/images/user2.png"
            : "/icons/chatsonic-fake.svg"
        }
      />
      <AvatarFallback>{message.sender === "user" ? "U" : "AI"}</AvatarFallback>
    </Avatar>
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3>{message.sender === "user" ? "You" : "Assistant"}</h3>
        <span className="text-xw-muted text-xs">{message.timestamp}</span>
      </div>
      <p className="text-xw-muted-foreground">{message.text}</p>
      {message.sender === "assistant" && (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">
            <Volume2Icon className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <RefreshCcw className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  </div>
);

export default AudioVerseMagicChatTab;
