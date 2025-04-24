import { trpc } from "~/trpc/react";
const useAudioChatExist = (audioProjectId: string) => {
  return trpc.audioProjectChat.isChatActive.useQuery({
    audioProjectId: audioProjectId ?? "",
  });
};

export default useAudioChatExist;
