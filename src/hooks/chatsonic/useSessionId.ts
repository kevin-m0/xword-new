import { useParams } from "next/navigation";

export const useSessionId = () => {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  return sessionId;
};