import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollArea } from '~/components/ui/scroll-area';
// import { useSuggestIdeas } from '../../../../_hooks/others/useSuggestIdeas';
// import { trpc } from '~/app/_trpc/client';
import { useAtom } from 'jotai';
import { MODEL_TYPE, modelTypeAtom } from '~/atoms';
import { DefaultChatComponent } from './DefaultChatComponent';
import ChatMessageInput from './ChatMessageInput';
// import { MESSAGES_LIMIT_CHAT } from '~/components/Editor/Sidebar/RightSidebar/AiContainer/ai-chat/constant';
import { MessageBubble } from './MessageBubble';
import { trpc } from '~/trpc/react';
import { useSuggestIdeas } from '~/hooks/misc/useSuggestIdeas';
import { MESSAGES_LIMIT_CHAT } from '~/lib/constant/chatsonic.constants';

const WriterXChatComponent = ({ id, content }: { id: string; content: string }) => {
    const [moveDown, setMoveDown] = useState(true);
    const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: user, isLoading: loadingUser } = trpc.user.getCurrentLoggedInUser.useQuery();
    const [modelType, setModelType] = useAtom<MODEL_TYPE>(modelTypeAtom);

    const { mutate: fetchSuggestions, isPending: loadingSuggestions } = useSuggestIdeas({
        onSuccess: ({ response }: { response: string[] }) => {
            setSuggestedPrompts(response);
        },
        onError: () => {
            setSuggestedPrompts([]);
        },
    });

    const { data, isLoading: isGettingChat, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
        trpc.llm.fetchChatsGivenDocId.useInfiniteQuery(
            {
                limit: MESSAGES_LIMIT_CHAT,
                id: id,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );

    const messages = useMemo(() => {
        return data?.pages.flatMap((page) => page.chats) || [];
    }, [data]);

    const loadMoreMessages = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    useEffect(() => {
        if (content && user?.id && messages && messages.length === 0) {
            fetchSuggestions({
                userId: user?.id as string,
                query: content,
                model: modelType,
            });
        }
    }, [id, content, fetchSuggestions, user?.id, modelType, messages]);

    useEffect(() => {
        if (moveDown && scrollRef.current) {
            // Scroll to the top since flex-col-reverse places new elements at the top
            scrollRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, [messages, moveDown]);

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 px-4" ref={scrollRef}>
                {!data || messages.length === 0 ? (
                    <DefaultChatComponent
                        suggestedPrompts={suggestedPrompts}
                        loading={loadingSuggestions}
                        name={user?.name as string}
                    />
                ) : (
                    <div className="flex flex-col-reverse gap-8 py-4">
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg.content}
                                role={msg.role}
                                createdAt={msg.created}
                                image={user?.image as string}
                                name={user?.name as string}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>

            <ChatMessageInput
                id={id}
                context={content}
                messages={messages}
                moveDown={moveDown}
                setMoveDown={setMoveDown}
            />
        </div>
    );
};

export default WriterXChatComponent;
