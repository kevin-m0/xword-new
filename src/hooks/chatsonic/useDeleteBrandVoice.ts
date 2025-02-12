import { trpc } from "~/trpc/react";

export const useDeleteBrandVoice = () => {
  const utils = trpc.useUtils();

  return trpc.chatsonic.deleteBrandVoice.useMutation({
    onSuccess: () => {
      utils.chatsonic.getBrandVoices.invalidate();
    },
  });
};
