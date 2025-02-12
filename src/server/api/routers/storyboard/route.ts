import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../../trpc";

export const storyboardRouter = createTRPCRouter({
  generateScript: privateProcedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        const body = {
          text: input,
          length: "500-600",
        };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate-text-video-script`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
              "Content-Type": "application/json",
              accept: "*/*",
            },
            body: JSON.stringify(body),
          },
        );

        return { success: true, script: await response.text() };
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Network error. Please check your connection.");
      }
    }),
});
