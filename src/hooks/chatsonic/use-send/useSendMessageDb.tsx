import { toast } from "sonner";

import { useSessionId } from "../useSessionId";
import { Message } from "~/types/chatsonic.types";
import { trpc } from "~/trpc/react";
import { ErrorToast } from "~/app/_components/custom-toast";

const useSendMessageDb = (isChatExist: boolean, isResponse: boolean) => {
  const utils = trpc.useUtils();
  const sessionId = useSessionId();

  return trpc.chatsonic.sendMessage.useMutation({
    onMutate: async (message: any) => {
      await utils.chatsonic.fetchAllMessages.cancel({ sessionId });
      const previousMessages =
        utils.chatsonic.fetchAllMessages.getData({ sessionId }) || [];

      if (!isResponse && sessionId && !isChatExist) {
        utils.chatsonic.fetchAllMessages.setData({ sessionId }, (prev) => {
          if (!prev) return [{ ...message, role: "user" } as Message];

          const messageExists = prev.some(
            (m) =>
              m.id === message.id ||
              (m.query === message.query && m.role === message.role),
          );

          if (messageExists) return prev;
          return [...prev, { ...message, role: "user" } as Message];
        });
      }

      return { previousMessages };
    },
    onSuccess: (data) => {
      if (isResponse) {
        utils.chatsonic.fetchAllMessages.setData({ sessionId }, (prev) => {
          if (!prev) return [data];
          const messageExists = prev.some((m) => m.id === data.id);
          if (messageExists) return prev;
          return [...prev, data];
        });
      }
    },
    onError(error, variables, context) {
      utils.chatsonic.fetchAllMessages.setData(
        { sessionId },
        context?.previousMessages,
      );
      console.error("SendMessage Error:", error);
      toast.custom((t) => (
        <ErrorToast t={t} title="Error" description="Failed to send message" />
      ));
    },
    onSettled: () => {
      utils.chatsonic.fetchAllMessages.invalidate({ sessionId });
    },
  });
};

export default useSendMessageDb;
