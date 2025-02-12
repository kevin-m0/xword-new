import { MODEL_TYPE } from "@/atoms";
import { suggestIdeas } from "@/services";
import { getIsSubscribed } from "@/services/stripe";
import { useMutation } from "@tanstack/react-query";

export const useSuggestIdeas = ({ ...options }) => {
  return useMutation({
    mutationFn: async ({
      userId,
      query,
      model
    }: {
      userId: string;
      query: string;
      model: MODEL_TYPE
    }) => {
      const payload = {
        userId,
        query,
        quantity: "3",
        model,
      };

      const isSubscribed = await getIsSubscribed();
      const { data } = await suggestIdeas(payload, isSubscribed);
      return data;
    },
    ...options,
  });
};
