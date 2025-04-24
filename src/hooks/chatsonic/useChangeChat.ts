import { useCallback } from "react";
import { useRouter } from "next/navigation";
const useChangeChat = () => {
  const router = useRouter();
  const handleChangeChat = useCallback(
    (id: string) => {
      router.push(`/chatsonic/${id}`);
    },
    [router]
  );

  return handleChangeChat;
};

export default useChangeChat;
