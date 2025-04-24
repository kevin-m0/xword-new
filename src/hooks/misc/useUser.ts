import { trpc } from "~/trpc/react";

export const useUser = () => {
  return trpc.user.getCurrentLoggedInUser.useQuery();
}