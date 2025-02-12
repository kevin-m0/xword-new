import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "~/trpc/react";
import { useSessionId } from "./useSessionId";

const useNewChat = () => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const currentSessionId = useSessionId();

  const handleNewChat = useCallback(async () => {
    // If we're already on a new session (not in DB), don't redirect
    if (currentSessionId) {
      const chatExists = await utils.chatsonic.isChatActive.fetch({ 
        sessionId: currentSessionId 
      });
      
      if (!chatExists) {
        return; // Already on a new session, do nothing
      }
    }
    
    const newId = crypto.randomUUID();
    
    // Pre-invalidate the cache for the new session
    utils.chatsonic.isChatActive.setData({ sessionId: newId }, false);
    utils.chatsonic.fetchAllMessages.setData({ sessionId: newId }, []);
    
    // Navigate to new chat
    router.push(`/chatsonic/${newId}`);
  }, [router, utils.chatsonic, currentSessionId]);

  return handleNewChat;
};

export default useNewChat;
