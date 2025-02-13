import { toast } from "sonner";
import { AudioProjectChat } from "@prisma/client";
import { trpc } from "~/trpc/react";
import { ErrorToast } from "../../custom-toast";
import { useDocumentId } from "~/hooks/editor/useDocumentId";
import { MESSAGES_LIMIT_CHAT } from "~/lib/constant/constants";

export const useUpdateChat = () => {
  const utils = trpc.useUtils();
  const documentId = useDocumentId();
  return trpc.llm.pushTranscribeChatsToDB.useMutation({
    onMutate: async (input) => {
      await utils.llm.fetchChatsGivenDocId.cancel();
      const previousChats = utils.llm.fetchChatsGivenRecId.getInfiniteData({
        limit: MESSAGES_LIMIT_CHAT,
        id: documentId as string,
      });

      const userQuery: AudioProjectChat = {
        id: crypto.randomUUID(),
        content: input.chat.content,
        createdAt: new Date().toISOString() as any,
        role: input.chat.role,
        audioProjectId: input.chat.recId,
      };

      utils.llm.fetchChatsGivenRecId.setInfiniteData(
        { limit: MESSAGES_LIMIT_CHAT, id: documentId as string },
        (data) => {
          if (!data) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          const firstPageChats = [...(data?.pages?.[0]?.chats || [])];
          // Insert the new chat at the start
          firstPageChats.unshift(userQuery);
          return {
            ...data,
            pages: [
              {
                chats: firstPageChats,
                nextCursor: data.pages[0]?.nextCursor as string,
              },
              ...data.pages.slice(1),
            ],
          };
        },
      );

      return { previousChats, userQuery };
    },
    onSuccess: () => {},
    onError: (err, input, ctx) => {
      utils.llm.fetchChatsGivenRecId.setInfiniteData(
        {
          limit: MESSAGES_LIMIT_CHAT,
          id: documentId as string,
        },
        ctx?.previousChats,
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
