import { trpc } from "~/trpc/react";

export const useDeleteAudioModels = () => {
  const utils = trpc.useUtils();

  return trpc.audio.deleteAudioModel.useMutation({
    onSuccess: () => {
      utils.audio.getAudioScripts.invalidate();
    },
  });
};
