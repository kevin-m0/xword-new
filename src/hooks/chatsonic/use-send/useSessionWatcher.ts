// useSessionWatcher.ts
import { useEffect, useRef } from "react";
import { useUser } from "../../misc/useUser";
import { trpc } from "~/trpc/react";

export function useSessionWatcher(sessionId?: string) {
  const { data: user } = useUser();
  const updatePersonalDataMutation = trpc.chatsonic.updatePersonalData.useMutation();
  const prevSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    if (sessionId !== prevSessionRef.current) {
      console.log("⚡️ useEffect: sessionId changed from", prevSessionRef.current, "to", sessionId);
      if (prevSessionRef.current) {
        // If we had an old session, update personal data for it
        const oldSession = prevSessionRef.current;
        console.log("🔶 updatePersonalData called for old session:", oldSession);
        updatePersonalDataMutation.mutate({ userId: user?.id ?? "", sessionId: oldSession });
      }
      prevSessionRef.current = sessionId;
    }
  }, [sessionId, user?.id, updatePersonalDataMutation]);
}
