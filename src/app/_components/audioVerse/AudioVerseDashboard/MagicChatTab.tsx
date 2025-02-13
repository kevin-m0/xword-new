"use client";

import React from "react";
import ChatLoading from "../../chatsonic/ChatLoading";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { cn } from "~/utils/utils";
import MessageInput from "./MessageInput";
import { recordingAtom } from "~/atoms";
import { useAtom } from "jotai";
import { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { HelpCircleIcon } from "lucide-react";
import { useDocumentId } from "~/hooks/editor/useDocumentId";
import { trpc } from "~/trpc/react";
import { MESSAGES_LIMIT_CHAT } from "~/lib/constant/constants";
import useMeasure from "~/hooks/misc/useMeasure";
import useChatExist from "~/hooks/chatsonic/useChatExist";
import MessagesLoader from "~/components/loaders/MessagesLoader";
import SingleMessage from "../../writerx/flow/chat-tab/SingleMessage";
import NoChatMessage from "./NoChatMessage";

function ChatBox() {
  const documentId = useDocumentId();

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
      <div className="flex flex-col rounded-xl bg-[#191a1d] px-6 py-4 text-lg text-gray-500">
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
      <div className="relative mb-3 h-[60vh] flex-1 overflow-hidden rounded-xl">
        <div
          className={cn(
            "absolute inset-0 rounded-xl bg-black",
            isChatExist ? "opacity-70" : "opacity-85",
          )}
          style={{ zIndex: 1 }}
        />

        {isChatExist ? (
          <div className="relative z-50 flex h-full w-full flex-col gap-0 bg-purple-500 px-10">
            {/* <MessagesContainer /> */}
            {/* <ChatInput sessionData={sessionData} isChatExist={isChatExist} /> */}
            <>
              {data?.pages &&
              data.pages?.[0] &&
              data.pages[0].chats.length > 0 ? (
                <div
                  className="scrollbar-thin scrollbar-track-border-primary scrollbar-thumb-primary relative z-10 flex h-[calc(100%-100px)] flex-col gap-3 overflow-x-hidden px-3 [overflow:overlay]"
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
                    className="flex h-[calc(100%-100px)] flex-col overflow-x-hidden"
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
                <div className="z-50 text-white">hai</div>
              ) : (
                <NoChatMessage />
              )}

              <div className="absolute bottom-0 left-0 right-0 z-10 mx-auto w-[calc(100%-24px)]">
                <MessageInput
                  context={recording?.transcript || ""}
                  messages={messages}
                />
              </div>
            </>
          </div>
        ) : (
          <div className="relative z-10 flex h-full w-full flex-col justify-between px-10">
            <ScrollArea
              className="font-nunitos relative z-10 flex h-full flex-grow flex-col justify-between overflow-y-auto"
              ref={ref}
            >
              <div
                className="scrollbar-thin scrollbar-track-border-primary scrollbar-thumb-primary relative z-10 flex h-[calc(100%-100px)] flex-col gap-3 overflow-x-hidden px-3 [overflow:overlay]"
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
                  className="flex h-[calc(100%-100px)] flex-col overflow-x-hidden"
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
