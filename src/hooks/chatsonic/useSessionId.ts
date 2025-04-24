import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export const useSessionId = () => {
  const params = useParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (params?.sessionId) {
      setSessionId(params.sessionId as string);
    } else if (!sessionId) {
      setSessionId(crypto.randomUUID()); // Generate once
    }
  }, [params?.sessionId]);

  return sessionId as string;
};
