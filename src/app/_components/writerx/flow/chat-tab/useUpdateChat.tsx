import { toast } from "sonner";
import { Chat } from "@prisma/client";
import { trpc } from "~/trpc/react";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { MESSAGES_LIMIT_CHAT } from "~/lib/constant/chatsonic.constants";

// import { MESSAGES_LIMIT_CHAT } from "@/components/Editor/Sidebar/RightSidebar/AiContainer/ai-chat/constant";
// import { useXWAlert } from "../../../reusable/xw-alert";

export const useUpdateChat = ({ documentId }: { documentId: string }) => {
    const utils = trpc.useUtils();
    const { showToast } = useXWAlert();
    return trpc.llm.pushChatsToDB.useMutation({
        onMutate: async (input) => {
            await utils.llm.fetchChatsGivenDocId.cancel();
            const previousChats = utils.llm.fetchChatsGivenDocId.getInfiniteData({
                limit: MESSAGES_LIMIT_CHAT,
                id: documentId,
            });

            const userQuery: Chat = {
                id: crypto.randomUUID(),
                content: input.chat.content,
                created: new Date().toISOString() as any,
                role: input.chat.role,
                documentId: input.chat.docId,
            };

            utils.llm.fetchChatsGivenDocId.setInfiniteData(
                { limit: MESSAGES_LIMIT_CHAT, id: documentId },
                (data) => {
                    if (!data) {
                        return {
                            pages: [],
                            pageParams: [],
                        };
                    }

                    const firstPageChats = [...(data?.pages?.[0]?.chats || [])]
                    // Insert the new chat at the start
                    firstPageChats.unshift(userQuery);
                    return {
                        ...data,
                        pages: [
                            { chats: firstPageChats, nextCursor: data?.pages?.[0]?.nextCursor },
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
                    id: documentId,
                },
                ctx?.previousChats
            );
            showToast({
                title: "Error",
                message: err.message,
                variant: "error",
            })
        },
        onSettled: () => {
            utils.llm.fetchChatsGivenDocId.invalidate({
                limit: MESSAGES_LIMIT_CHAT,
                id: documentId,
            });
        },
    });
};
