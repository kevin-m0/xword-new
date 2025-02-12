import { db } from "~/server/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createChatSchema, MessageSchema, BrandVoiceSchema } from "./schema";
import axios from "axios";
import { createTRPCRouter, privateProcedure } from "../../trpc";
import { getFileInfo } from "../aws/route";

export const chatSonicRouter = createTRPCRouter({
  createChat: privateProcedure
  .input(createChatSchema)
  .mutation(async ({ input }) => {
    const { id, title, userId, lastPromptPayload } = input;
    console.log({ id, title, userId, lastPromptPayload });
    return await db.sonicChat.create({
      data: {
        id: id ?? crypto.randomUUID(),
        title: title ?? "Untitled",
        userId: userId,
        lastPromptPayload: lastPromptPayload,
      },
    });
  }),

  updateLastPrompt: privateProcedure
  .input(
    z.object({
      sessionId: z.string(),
      lastPromptPayload: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { sessionId, lastPromptPayload } = input;

    // Parse the payload to get the query, if present
    const payload = JSON.parse(lastPromptPayload || "{}");
    const queryTitle = payload.query ? payload.query.slice(0, 36) : null;

    const response = await db.sonicChat.update({
      where: { id: sessionId },
      data: { lastPromptPayload },
    });

    if (!response) {
      throw new TRPCError({
        message: "Error in updating chat",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    return response;
  }),

  deleteChat: privateProcedure
  .input(
    z.object({
      sessionId: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const { sessionId } = input;

    const chat = await db.sonicChat.findFirst({
      where: {
        id: sessionId,
      },
    });
    if (!chat) {
      throw new TRPCError({
        message: "Chat not found",
        code: "NOT_FOUND",
      });
    }
    const response = db.sonicChat.delete({
      where: { id: input.sessionId },
    });
    if (!response) {
      throw new TRPCError({
        message: "Error in deleting chat",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    return response;
  }),

  updateChatTitle: privateProcedure
  .input(
    z.object({
      sessionId: z.string(),
      title: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const { sessionId, title } = input;
    const chat = await db.sonicChat.findFirst({
      where: {
        id: sessionId,
      },
    });
    if (!chat) {
      throw new TRPCError({
        message: "Chat not found",
        code: "NOT_FOUND",
      });
    }
    const response = await db.sonicChat.update({
      where: { id: input.sessionId },
      data: { title: title },
    });
    if (!response) {
      throw new TRPCError({
        message: "Error in updating chat",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    return response;
  }),

  updatePersonalData: privateProcedure
  .input(
    z.object({
      userId: z.string(),
      sessionId: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const { userId, sessionId } = input;

    // Only proceed if we have both userId and sessionId
    if (!userId || !sessionId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing required fields",
      });
    }
    try {
      const url = `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/chatbot/update-personal-data`;
      const config = {
        headers: {
          Authorization: "Bearer" + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
      };
      const res = await axios.post(url, { userId, sessionId }, config);
      if (res && res.data) {
        return res.data;
      }
      throw new Error("No data received from personal data update");
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update personal data",
      });
    }
  }),

// for storing chat messages in db
  sendMessage: privateProcedure
  .input(MessageSchema)
  .mutation(async ({ input }) => {
    const {
      userId,
      sessionId,
      avatarId,
      brandVoice,
      lastMessages,
      mode,
      fileIds,
      category,
      publishDate,
      includeDomains,
      otherFiles,
      Urls,
      query,
      role,
      sources,
    } = input;
    try {
      let chat = await db.sonicChat.findUnique({
        where: { id: sessionId },
      });

      if (!chat) {
        chat = await db.sonicChat.create({
          data: {
            id: sessionId,
            userId,
            title: query.slice(0, 36),
          },
        });
      }

      // Now create the SonicMessage
      const message = await db.sonicMessage.create({
        data: {
          id: crypto.randomUUID(),
          userId,
          sessionId,
          avatarId,
          brandVoice: brandVoice || {},
          lastMessages,
          mode,
          fileIds: fileIds || [],
          category,
          publishDate,
          includeDomains: includeDomains || [],
          otherFiles: otherFiles || {},
          Urls: Urls || [],
          query,
          role,
          sources: sources || null,
        },
      });

      return message;
    } catch (error) {
      console.error("SendMessage Error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send message",
      });
    }
  }),

  fetchAllChats: privateProcedure.query(async ({ ctx }) => {
    const chats = await db.sonicChat.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        createdAt: "desc", // Change to ascending order
      },
    });
    if (!chats)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch Chats from db",
      });
    return chats;
  }),
  
//fetch paginated chat can be used for infinite scroll or pagination
  fetchChats: privateProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
  )
  .query(async ({ input, ctx }) => {
    try {
      const { cursor } = input;
      const limit = input.limit ?? 5;
      const chats = await db.sonicChat.findMany({
        take: limit + 1, // Fetch one extra to get the next cursor
        where: {
          userId: ctx.userId,
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
      return {
        chats,
        nextCursor,
      };

      // return chats;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch Chats from db",
      });
    }
  }),

  fetchAllMessages: privateProcedure
  .input(z.object({ sessionId: z.string() }))
  .query(async ({ input, ctx }) => {
    const messages = await db.sonicMessage.findMany({
      where: {
        sessionId: input.sessionId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  }),

//to check if chat exists with given sessionId
  isChatActive: privateProcedure
  .input(z.object({ sessionId: z.string() }))
  .query(async ({ input }) => {
    const { sessionId } = input;
    try {
      // Check if chat exists in database
      const chat = await db.sonicChat.findFirst({
        where: {
          id: sessionId,
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

  searchChat: privateProcedure
  .input(z.object({ searchTerm: z.string() }))
  .query(async ({ input, ctx }) => {
    const { searchTerm } = input;

    const chatList = await db.sonicChat.findMany({
      where: {
        userId: ctx.userId,
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });
    if (!chatList)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "search error",
      });

    return chatList;
  }),

// for fetching last prompt payload
  lastPromptPayload: privateProcedure
  .input(z.object({ sessionId: z.string() }))
  .query(async ({ input }) => {
    const { sessionId } = input;
    try {
      const chat = await db.sonicChat.findUnique({ where: { id: sessionId } });
      if (chat) {
        return chat.lastPromptPayload;
      } else return null;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "unknown error",
      });
    }
  }),

  fetchFollowUpQuestions: privateProcedure
  .input(
    z.object({
      lastMessage: z.string().nullable(),
      brandVoice: z.object({}).nullable(),
    }),
  )
  .query(async ({ ctx, input }) => {
    if (!input.lastMessage || input.lastMessage === "") return null;
    const payload = { userId: ctx.userId, lastMsg: input.lastMessage };
    const url = `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/chatbot/chat-recommendations`;
    const config = {
      headers: {
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
      },
    };
    try {
      const res = await axios.post(url, payload, config);

      if (res && res.data) return res.data;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    } catch (err) {
      return null;
    }
  }),

  createBrandVoice: privateProcedure
  .input(BrandVoiceSchema)
  .mutation(async ({ ctx, input }) => {
    const {
      name,
      specialization,
      audience,
      purpose,
      tone,
      emotions,
      character,
      genre,
      languageStyle,
      brandVoice,
    } = input;

    const BrandVoice = await db.editorBrandVoice.create({
      data: {
        name,
        specialization,
        audience,
        purpose,
        tone,
        emotions,
        character,
        genre,
        languageStyle,
        brandVoice,
        userId: ctx.userId,
      },
    });
    if (!BrandVoice) {
      throw new TRPCError({
        message: "Error in creating BrandVoice",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    return BrandVoice;
  }),

  getBrandVoices: privateProcedure.query(async ({ ctx }) => {
    const brandVoices = await db.editorBrandVoice.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  
    return brandVoices;
  }),

  deleteBrandVoice: privateProcedure
  .input(
    z.object({
      brandVoiceId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { brandVoiceId } = input;

    const existingBrandVoice = await db.editorBrandVoice.findFirst({
      where: {
        id: brandVoiceId,
        userId: ctx.userId,
      },
    });

    if (!existingBrandVoice) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "We couldn't find the brand voice you are trying to delete.",
      });
    }

    const brandVoice = await db.editorBrandVoice.delete({
      where: {
        id: brandVoiceId,
      },
    });
    return brandVoice;
  }),

  hasMessagesInSession: privateProcedure
  .input(z.object({ sessionId: z.string() }))
  .query(async ({ input }) => {
    const messagesCount = await db.sonicMessage.count({
      where: { sessionId: input.sessionId },
    });
    return messagesCount > 0;
  }),

  getFileInfoProcedure: privateProcedure
  .input(z.object({ fileId: z.string() }))
  .query(async ({ input }) => {
    const fileInfo = await getFileInfo(input.fileId);
    if (!fileInfo) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "File information not found",
      });
    }
    return fileInfo;
  }),

  getAudioFiles: privateProcedure
  .input(z.object({ keys: z.array(z.string()) }))
  .query(async ({ input }) => {
    const audioFiles = await Promise.all(
      input.keys.map(async (key) => {
        const fileInfo = await getFileInfo(key);
        return fileInfo;
      }),
    );
    return audioFiles.filter(
      (file): file is NonNullable<typeof file> => file !== null,
    );
  }),

  getAvatars: privateProcedure.query(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/chatbot/get-all-avatars`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch avatars",
      });
    }
  }),
  

})

//for like or dislike a message
// export const updateMessageReaction = privateProcedure
//   .input(
//     z.object({
//       id: z.string(),
//       isLiked: z.boolean().nullable(),
//     })
//   )
//   .mutation(async ({ input }) => {
//     const { isLiked, id } = input;

//     const response = await db.sonicMessage.update({
//       where: { id: id },
//       data: {
//         isLiked,
//       },
//     });
//     if (!response) {
//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: "Failed to update Reaction",
//       });
//     }
//     return response;
//   });



//paginated Messages for infinite scroll or messages
// export const fetchMessages = privateProcedure
//   .input(
//     z.object({
//       chatId: z.string(),
//       limit: z.number().min(1).max(100).nullish(),
//       cursor: z.string().nullish(),
//     })
//   )
//   .query(async ({ input, ctx }) => {
//     try {
//       const { cursor, chatId } = input;
//       const limit = input.limit ?? 5;
//       const messages = await db.sonicMessage.findMany({
//         take: limit + 1, // Fetch one extra to get the next cursor
//         where: {
//           sessionId,
//         },
//         cursor: cursor ? { id: cursor } : undefined,
//         orderBy: {
//           createdAt: "desc",
//         },
//       });
//       let nextCursor: typeof cursor | undefined = undefined;
//       if (messages.length > limit) {
//         const nextItem = messages.pop();
//         nextCursor = nextItem!.id;
//       }
//       return {
//         messages,
//         nextCursor,
//       };
//     } catch (err) {
//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: "Failed to fetch Messages from db",
//       });
//     }
//   });