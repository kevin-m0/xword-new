import { toast } from "sonner";
import { Chat } from "@prisma/client";

import { useDocumentId } from "./useDocumentId";
import { MESSAGES_LIMIT_CHAT } from "./constant";
import { trpc } from "~/trpc/react";
import { ErrorToast } from "~/app/_components/custom-toast";

export const useUpdateChat = () => {
    const utils = trpc.useUtils();
    const documentId = useDocumentId();
    return trpc.llm.pushChatsToDB.useMutation({
        onMutate: async (input) => {
            await utils.llm.fetchChatsGivenDocId.cancel();
            const previousChats = utils.llm.fetchChatsGivenDocId.getInfiniteData({
                limit: MESSAGES_LIMIT_CHAT,
                id: documentId as string,
            });

            const userQuery: Chat = {
                id: crypto.randomUUID(),
                content: input.chat.content,
                created: new Date().toISOString() as any,
                role: input.chat.role,
                documentId: input.chat.docId,
            };

            utils.llm.fetchChatsGivenDocId.setInfiniteData(
                { limit: MESSAGES_LIMIT_CHAT, id: documentId as string },
                (data) => {
                    if (!data) {
                        return {
                            pages: [],
                            pageParams: [],
                        };
                    }
                    
                    const firstPageChats = [...(data?.pages[0]?.chats ?? [])];
                    // Insert the new chat at the start
                    firstPageChats.unshift(userQuery);
                    return {
                        ...data,
                        pages: [
                            { chats: firstPageChats, nextCursor: data?.pages[0]?.nextCursor },
                            ...data.pages.slice(1),
                        ],
                    };
                }
            );

            return { previousChats, userQuery };
        },
        onSuccess: () => { },
        onError: (err, input, ctx) => {
            utils.llm.fetchChatsGivenDocId.setInfiniteData(
                {
                    limit: MESSAGES_LIMIT_CHAT,
                    id: documentId as string,
                },
                ctx?.previousChats
            );
            toast.custom((t) => (
                <ErrorToast
                    t={t}
                    title=""
                    description="Something went wrong. Please try again."
                />
            ));
        },
        onSettled: () => {
            utils.llm.fetchChatsGivenDocId.invalidate({
                limit: MESSAGES_LIMIT_CHAT,
                id: documentId,
            });
        },
    });
};
