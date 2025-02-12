import { db } from "~/server/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../../trpc";

export const llmRouter = createTRPCRouter({
  pushChatsToDB: publicProcedure
  .input(
    z.object({
      chat: z.object({
        role: z.string(),
        content: z.string(),
        docId: z.string(),
      }),
    }),
  )
  .mutation(async ({ input }) => {
    // push to db
    try {
      const chat = await db.chat.create({
        data: {
          role: input.chat.role,
          content: input.chat.content,
          documentId: input.chat.docId,
        },
      });

      return chat;
    } catch (err) {
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to push Chat to db",
      });
    }
  }),

  fetchChatsGivenDocId: publicProcedure
  .input(
    z.object({
      id: z.string(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
  )
  .query(async ({ input }) => {
    try {
      console.log(input);
      const { cursor } = input;
      const limit = input.limit ?? 5;
      const chats = await db.chat.findMany({
        take: limit + 1, // Fetch one extra to get the next cursor
        where: {
          documentId: input.id,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          created: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (chats.length > limit) {
        const nextItem = chats.pop();
        nextCursor = nextItem!.id;
      }
      console.log(nextCursor);
      return {
        chats,
        nextCursor,
      };
    } catch (err) {
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch Chats from db",
      });
    }
  }),
  pushTranscribeChatsToDB: publicProcedure
  .input(
    z.object({
      chat: z.object({
        role: z.enum(["user", "ai"]),
        content: z.string(),
        recId: z.string(),
      }),
    }),
  )
  .mutation(async ({ input }) => {
    // push to db
    try {
      const chat = await db.audioProjectChat.create({
        data: {
          role: input.chat.role,
          content: input.chat.content,
          audioProjectId: input.chat.recId,
        },
      });

      return chat;
    } catch (err) {
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to push Chat to db",
      });
    }
  }),
  fetchChatsGivenRecId: publicProcedure
  .input(
    z.object({
      id: z.string(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
  )
  .query(async ({ input }) => {
    try {
      console.log(input);
      const { cursor } = input;
      const limit = input.limit ?? 5;
      const chats = await db.audioProjectChat.findMany({
        take: limit + 1, // Fetch one extra to get the next cursor
        where: {
          audioProjectId: input.id,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (chats.length > limit) {
        const nextItem = chats.pop();
        nextCursor = nextItem!.id;
      }
      console.log(nextCursor);
      return {
        chats,
        nextCursor,
      };
    } catch (err) {
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch Chats from db",
      });
    }
  })
});


