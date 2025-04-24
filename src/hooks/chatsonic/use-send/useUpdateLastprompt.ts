import { trpc } from "~/trpc/react";
import { useSessionId } from "../useSessionId";

export default function useUpdateLastprompt() {
  const utils = trpc.useUtils();
  const sessionId = useSessionId();
  const updateLastPromptMutation = trpc.chatsonic.updateLastPrompt.useMutation({
    onMutate: (data) => {
      // Cancel any outgoing refetches
      utils.chatsonic.lastPromptPayload.cancel({ sessionId: data.sessionId });

      // Snapshot old data
      const prevPayload = utils.chatsonic.lastPromptPayload.getData({
        sessionId: data.sessionId,
      });

      // Optimistically set the new data
      utils.chatsonic.lastPromptPayload.setData(
        { sessionId: data.sessionId },
        data.lastPromptPayload
      );

      return { prevPayload };
    },
    onError: (_err, data, context) => {
      // revert to old data
      if (context?.prevPayload) {
        utils.chatsonic.lastPromptPayload.setData(
          { sessionId: data.sessionId },
          context.prevPayload
        );
      }
    },
    onSettled: () => {
      // revalidate
      utils.chatsonic.lastPromptPayload.invalidate({ sessionId: sessionId });
    },
  });

  return {
    updateLastPromptMutation,
    sessionId,
  };
}
