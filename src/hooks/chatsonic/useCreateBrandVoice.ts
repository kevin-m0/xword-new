import { trpc } from "~/trpc/react";

export const useCreateBrandVoice = ({
  handleCleanups,
}: {
  handleCleanups: () => void;
}) => {
  const utils = trpc.useUtils();

  return trpc.chatsonic.createBrandVoice.useMutation({
    onSuccess() {
      handleCleanups();
      utils.chatsonic.getBrandVoices.invalidate();
    },
  });
};
