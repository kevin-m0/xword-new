// useSessionWatcher.ts
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { trpc } from "~/trpc/react";

export function useSessionWatcher(sessionId?: string) {
  const { user } = useUser();

  const updatePersonalDataMutation =
    trpc.chatsonic.updatePersonalData.useMutation();

  const prevSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      console.log("in session watcher");
      return;
    }

    if (sessionId !== prevSessionRef.current) {
      console.log(
        "⚡️ useEffect: sessionId changed from",
        prevSessionRef.current,
        "to",
        sessionId,
      );
      if (prevSessionRef.current) {
        // If we had an old session, update personal data for it
        const oldSession = prevSessionRef.current;
        console.log(
          "🔶 updatePersonalData called for old session:",
          oldSession,
        );
        updatePersonalDataMutation.mutate({
          userId: user?.id ?? "",
          sessionId: oldSession,
        });
      }
      prevSessionRef.current = sessionId;
    }
  }, [sessionId, user?.id, updatePersonalDataMutation]);
}
