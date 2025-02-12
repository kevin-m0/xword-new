import { trpc } from "~/trpc/react";

export const getBrandVoices = () => {
  return trpc.chatsonic.getBrandVoices.useQuery();
};
