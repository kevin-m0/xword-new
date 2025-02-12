import { trpc } from "~/trpc/react";
import { useSessionId } from "./useSessionId";

const useChatExist = () => {
  const sessionId = useSessionId();
  return trpc.chatsonic.isChatActive.useQuery({ sessionId: sessionId ?? '' });
};

export default useChatExist;
