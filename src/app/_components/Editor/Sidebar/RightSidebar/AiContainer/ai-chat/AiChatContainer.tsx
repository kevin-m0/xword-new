// import { Editor } from "@tiptap/react";
// import { User } from "lucide-react";
// import { useRef, useState, useMemo } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";

// import { cn } from "@/utils/utils";
// import AiIcon from "@/icons/AiIcon";
// import { trpc } from "@/app/_trpc/client";
// import MessageInput from "./MessageInput";
// import NoChatMessage from "./NoChatMessage";
// import SingleMessage from "./SingleMessage";
// import MessagesLoader from "./MessagesLoader";
// import { useDocumentId } from "./useDocumentId";
// import { MESSAGES_LIMIT_CHAT } from "./constant";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ChevronDown } from "@/icons/Figma";

// const AiChatContainer = ({ editor }: { editor: Editor }) => {
//     const [isOpenAiChatContainer, setIsOpenAiChatContainer] = useState(true);
//     const chatContainerRef = useRef<HTMLDivElement>(null);

//     const documentId = useDocumentId();

//     const scrollToBottom = () => {
//         const chatContainer = chatContainerRef.current;

//         if (chatContainer) {
//             chatContainer.scrollTo(0, chatContainer.scrollHeight);
//         }
//     };

//     const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
//         trpc.llm.fetchChatsGivenDocId.useInfiniteQuery(
//             {
//                 limit: MESSAGES_LIMIT_CHAT,
//                 id: documentId,
//             },
//             {
//                 getNextPageParam: (lastPage) => lastPage.nextCursor,
//                 // initialCursor: 1, // <-- optional you can pass an initialCursor
//             }
//         );

//     const dropToKeyboard = (content: string) => {
//         editor
//             .chain()
//             .focus()
//             .insertContentAt(editor.state.selection.anchor, content)
//             .run();
//     };

//     const messages = useMemo(() => {
//         return data?.pages.flatMap((page) => page.chats) || [];
//     }, [data]);

//     const loadMoreMessages = () => {
//         if (hasNextPage && !isFetchingNextPage) {
//             fetchNextPage();
//         }
//     };

//     return (
//         <div
//             className={cn(
//                 "border border-white border-opacity-10 bg-black bg-opacity-50 rounded-[12px] relative overflow-hidden",
//                 isOpenAiChatContainer ? "flex-1" : "h-max"
//             )}
//         >
//             {/* <div className="absolute ai-container-bg" /> */}
//             {/* <div className="absolute ai-container-bgb" /> */}
//             <div className="flex items-center gap-2 p-3 relative z-10">
//                 <div
//                     className={cn(
//                         "cursor-pointer transition",
//                         !isOpenAiChatContainer && "rotate-180"
//                     )}
//                     onClick={() => setIsOpenAiChatContainer((prev) => !prev)}
//                 >
//                     <ChevronDown />
//                 </div>
//                 <span
//                     className="text-sm lg:text-md flex items-center"
//                     onClick={scrollToBottom}
//                 >
//                     <AiIcon />
//                     &nbsp;AI Helper
//                 </span>
//             </div>
//             {isOpenAiChatContainer && (
//                 <>
//                     {data?.pages && data.pages[0].chats.length > 0 ? (
//                         <div
//                             className="h-[calc(100%-100px)] flex flex-col gap-3 px-3 
//               [overflow:overlay]
//               scrollbar-thin scrollbar-track-border-primary
//               scrollbar-thumb-primary overflow-x-hidden relative z-10"
//                             id="scrollableDiv"
//                             ref={chatContainerRef}
//                             style={{ display: "flex", flexDirection: "column-reverse" }}
//                         >
//                             <InfiniteScroll
//                                 dataLength={messages.length}
//                                 next={loadMoreMessages}
//                                 hasMore={hasNextPage as boolean}
//                                 loader={<MessagesLoader />}
//                                 inverse={true}
//                                 style={{ display: "flex", flexDirection: "column-reverse" }}
//                                 scrollableTarget={"scrollableDiv"}
//                                 initialScrollY={0}
//                                 className="h-[calc(100%-100px)] overflow-x-hidden flex flex-col"
//                             >
//                                 {messages.map((msg) => (
//                                     <SingleMessage
//                                         dropToKeyboard={dropToKeyboard}
//                                         key={msg.id}
//                                         msg={{
//                                             content: msg.content,
//                                             created: msg.created as any as string,
//                                             id: msg.id,
//                                             role: msg.role,
//                                         }}
//                                     />
//                                 ))}
//                             </InfiniteScroll>
//                         </div>
//                     ) : isFetching || isFetchingNextPage ? (
//                         <ChatSkeleton />
//                     ) : (
//                         <NoChatMessage />
//                     )}

//                     <div className="absolute left-0 right-0 mx-auto bottom-0 w-[calc(100%-24px)] z-10">
//                         <MessageInput
//                             context={editor ? editor.getText() : ""}
//                             scrollIntoView={scrollToBottom}
//                             messages={messages}
//                         />
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default AiChatContainer;

// const ChatSkeleton = ({ length = 11 }: { length?: number }) => {
//     return (
//         <>
//             <div
//                 className="relative z-10"
//                 style={{ maxHeight: "79%", overflowY: "hidden" }}
//             >
//                 {Array.from({ length }).map((_, i) => (
//                     <div
//                         key={i}
//                         className="flex items-start gap-2 mt-2 my-2 px-3"
//                     >
//                         <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-2 rounded-full">
//                             <User className="h-4 w-4" />
//                         </div>
//                         <div className="border border-border-primary p-2 rounded-xl w-full overflow-hidden">
//                             <Skeleton className="h-3 w-full" />
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </>
//     );
// };
