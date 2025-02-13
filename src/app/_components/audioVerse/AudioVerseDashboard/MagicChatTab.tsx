"use client";

import React from "react";
// import useGetSession from "../chat-sonic/hooks/useGetSession";
import useChatExist from "@/app/(site)/(dashboard)/_hooks/chatsonic/useChatExist";
import ChatLoading from "../../chatsonic/ChatLoading";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMeasure from "../../../_hooks/others/useMeasure";
import { useEffect, useRef } from "react";
import { cn } from "@/utils/utils";
import MessageInput from "./MessageInput";
import { recordingAtom } from "@/atoms";
import { useAtom } from "jotai";
import { trpc } from "@/app/_trpc/client";
import { useDocumentId } from "@/components/Editor/Sidebar/RightSidebar/AiContainer/ai-chat/useDocumentId";
import { MESSAGES_LIMIT_CHAT } from "@/components/Editor/Sidebar/RightSidebar/AiContainer/ai-chat/constant";
import { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import MessagesLoader from "@/components/Editor/Sidebar/RightSidebar/AiContainer/ai-chat/MessagesLoader";
import NoChatMessage from "@/components/Editor/Sidebar/RightSidebar/AiContainer/ai-chat/NoChatMessage";
import SingleMessage from "@/components/Editor/Sidebar/RightSidebar/AiContainer/ai-chat/SingleMessage";
import { HelpCircleIcon } from "lucide-react";

function ChatBox() {
  const documentId = useDocumentId();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    trpc.llm.fetchChatsGivenRecId.useInfiniteQuery(
      {
        limit: MESSAGES_LIMIT_CHAT,
        id: documentId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // initialCursor: 1, // <-- optional you can pass an initialCursor
      },
    );

  const messages = useMemo(() => {
    return data?.pages.flatMap((page) => page.chats) || [];
  }, [data]);

  const [ref, { height }] = useMeasure();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const {
    data: isChatExist,
    isLoading: isChatExistLoading,
    isError: chatExistError,
  } = useChatExist();
  // const {
  //   data: sessionData,
  //   isLoading: isSessionLoading,
  //   isError: sessionError,
  // } = useGetSession();

  const [recording] = useAtom(recordingAtom);

  useEffect(() => {
    if (bottomRef.current && height < 400) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [height]);

  if (isChatExistLoading) return <ChatLoading />;
  if (chatExistError) return <p>Something went wrong</p>;

  const dropToKeyboard = () => {
    console.log("dropToKeyboard");
  };

  const loadMoreMessages = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="">
      <div className="bg-[#191a1d] text-gray-500 text-lg px-6 py-4 rounded-xl flex flex-col">
        <p className="flex items-center gap-x-2 text-white">
          <HelpCircleIcon />
          Welcome to Chat by xWord.
        </p>
        <p>
          Using the prompt input below, you can ask anything you want about this
          recording. I know all the important concepts of this recording, you
          can think of me like your personal assistant. Use me to generate new
          types of content, or as a source for new ideas.
        </p>
      </div>
      <div className="mb-3 relative flex-1 rounded-xl overflow-hidden h-[60vh] ">
        <div
          className={cn(
            "absolute inset-0 rounded-xl bg-black",
            isChatExist ? "opacity-70" : "opacity-85",
          )}
          style={{ zIndex: 1 }}
        />

        {isChatExist ? (
          <div className="h-full flex flex-col gap-0 relative z-50 bg-purple-500 w-full px-10">
            {/* <MessagesContainer /> */}
            {/* <ChatInput sessionData={sessionData} isChatExist={isChatExist} /> */}
            <>
              {data?.pages && data.pages[0].chats.length > 0 ? (
                <div
                  className="h-[calc(100%-100px)] flex flex-col gap-3 px-3 
              [overflow:overlay]
              scrollbar-thin scrollbar-track-border-primary
              scrollbar-thumb-primary overflow-x-hidden relative z-10"
                  id="scrollableDiv"
                  // ref={chatContainerRef}
                  style={{ display: "flex", flexDirection: "column-reverse" }}
                >
                  <InfiniteScroll
                    dataLength={messages.length}
                    next={loadMoreMessages}
                    hasMore={hasNextPage as boolean}
                    loader={<MessagesLoader />}
                    inverse={true}
                    style={{ display: "flex", flexDirection: "column-reverse" }}
                    scrollableTarget={"scrollableDiv"}
                    initialScrollY={0}
                    className="h-[calc(100%-100px)] overflow-x-hidden flex flex-col"
                  >
                    <p className="mb-5 text-white">
                      Using the prompt input below, you can ask anything you
                      want about this recording. I know all the important
                      concepts of this recording, you can think of me like your
                      personal assistant. Use me to generate new types of
                      content, or as a source for new ideas.
                    </p>
                    {messages.map((msg) => (
                      <SingleMessage
                        dropToKeyboard={dropToKeyboard}
                        key={msg.id}
                        msg={{
                          content: msg.content,
                          created: msg.createdAt as any as string,
                          id: msg.id,
                          role: msg.role,
                          // userId: msg.userId,
                          // brandVoice: msg.brandVoice,
                          // sessionId: msg.sessionId,
                        }}
                      />
                    ))}
                  </InfiniteScroll>
                </div>
              ) : isFetching || isFetchingNextPage ? (
                <div className="text-white z-50">hai</div>
              ) : (
                <NoChatMessage />
              )}

              <div className="absolute left-0 right-0 mx-auto bottom-0 w-[calc(100%-24px)] z-10">
                <MessageInput
                  context={recording?.transcript || ""}
                  messages={messages}
                />
              </div>
            </>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-between relative z-10 w-full px-10">
            <ScrollArea
              className="z-10 flex flex-col h-full justify-between font-nunitos flex-grow overflow-y-auto relative"
              ref={ref}
            >
              <div
                className="h-[calc(100%-100px)] flex flex-col gap-3 px-3 
              [overflow:overlay]
              scrollbar-thin scrollbar-track-border-primary
              scrollbar-thumb-primary overflow-x-hidden relative z-10"
                id="scrollableDiv"
                // ref={chatContainerRef}
                style={{ display: "flex", flexDirection: "column-reverse" }}
              >
                <InfiniteScroll
                  dataLength={messages.length}
                  next={loadMoreMessages}
                  hasMore={hasNextPage as boolean}
                  loader={<MessagesLoader />}
                  inverse={true}
                  style={{ display: "flex", flexDirection: "column-reverse" }}
                  scrollableTarget={"scrollableDiv"}
                  initialScrollY={0}
                  className="h-[calc(100%-100px)] overflow-x-hidden flex flex-col"
                >
                  {messages.map((msg) => (
                    <SingleMessage
                      dropToKeyboard={dropToKeyboard}
                      key={msg.id}
                      msg={{
                        content: msg.content,
                        created: msg.createdAt as any as string,
                        id: msg.id,
                        role: msg.role,
                        // userId: msg.userId,
                        // brandVoice: msg.brandVoice,
                        // sessionId: msg.sessionId,
                      }}
                    />
                  ))}
                </InfiniteScroll>
              </div>
              <div className="flex flex-col justify-between gap-5">
                <div ref={bottomRef}></div>
              </div>
            </ScrollArea>
            <div className="flex-none">
              {/* <ChatInput sessionData={sessionData} isChatExist={isChatExist} /> */}
              <MessageInput
                context={recording?.transcript || ""}
                messages={messages}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBox;
