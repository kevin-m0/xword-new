import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { createTRPCRouter, privateProcedure } from "../../trpc";

export const audioProjectChatRouter = createTRPCRouter({
  getAudioProjectChatById: privateProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    const data = {
      ...input,
    };
    const res = await db.audioProjectChat.findUnique({
      where: { id: data.id },
    });
    if (!res) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return res;
  }),

  getAllAudioProjects: privateProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ input }) => {
    try {
      const res = await db.audioProject.findMany({
        where: {
          workspaceId: input.id,
        },
        include: {
          createdByUser: true,
        },
      });

      return res;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch prompt by ID: ${error}`,
      });
    }
  }),
  isChatActive: privateProcedure
  .input(z.object({ audioProjectId: z.string() }))
  .query(async ({ input }) => {
    const { audioProjectId } = input;
    try {
      // Check if chat exists in database
      const chat = await db.audioProjectChat.findFirst({
        where: {
          audioProjectId: audioProjectId,
        },
      });

      // Return true if chat exists
      return !!chat;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unknown error",
      });
    }
  }),

})