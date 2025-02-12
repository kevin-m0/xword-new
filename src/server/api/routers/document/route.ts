import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ACCESSTYPE, ROLE } from "@prisma/client";

import { db } from "~/server/db";
import * as spaceApi from "~/server/api/routers/workspace/api";
import { fetchPromptByIdForContentGen } from "~/services/llm";
import { createTRPCRouter, privateProcedure } from "../../trpc";

export const documentRouter = createTRPCRouter({
  fetchDocuments: privateProcedure
  .input(
    z.object({
      folderId: z.string().optional(),
      organizationId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { folderId } = input;
    //this call to get active sapce will throw trpc error in case active space is null
    const data = await spaceApi.fetchActiveSpaceForUser(
      userId,
      input.organizationId,
    );
    const whereClause = folderId
      ? {
          folderId: folderId,
          userId: userId,
        }
      : {
          spaceId: data?.id,
          folderId: null,
          userId: userId,
        };
    const documents = await db.document.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: true,
      },
    });
    return documents;
  }),
  fetchDocumentsByWorkSpaceId:privateProcedure
  .input(
    z.object({
      workspaceId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { workspaceId } = input;
    //this call to get active sapce will throw trpc error in case active space is null
  
    const documents = await db.document.findMany({
      where: {
        spaceId : workspaceId,
        redirectType : "Social"
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return documents;
  }),
  fetchPaginatedSharedDocument: privateProcedure
  .input(
    z.object({
      spaceId: z.string().optional(),
      folderId: z.string().optional(),
      order: z.string().optional(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { order, cursor } = input;
    const limit = input.limit ?? 10;

    const documents = await db.document.findMany({
      take: limit + 1,
      where: {
        userId,
        role: ROLE.USER,
        spaceId: null,
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy:
        order === "alphabetically"
          ? { title: "asc" }
          : order === "recent"
            ? { updatedAt: "desc" }
            : order === "mostViewed"
              ? { viewCount: "desc" }
              : undefined,
    });
    let nextCursor: typeof cursor | undefined = undefined;

    if (documents.length > limit) {
      const nextItem = documents.pop();
      nextCursor = nextItem!.id;
    }
    return {
      documents,
      nextCursor,
    };
  }),
  fetchPaginatedStarredDocument: privateProcedure
  .input(
    z.object({
      folderId: z.string().optional(),
      spaceId: z.string(),
      order: z.string().optional(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      organizationId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { spaceId, order, cursor, organizationId } = input;
    const limit = input.limit ?? 10;

    const documents = await db.document.findMany({
      take: limit + 1,
      where: {
        userId,
        spaceId: spaceId,
        // organizationId,
        isStarred: true,
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy:
        order === "alphabetically"
          ? { title: "asc" }
          : order === "recent"
            ? { updatedAt: "desc" }
            : order === "mostViewed"
              ? { viewCount: "desc" }
              : undefined,
    });
    let nextCursor: typeof cursor | undefined = undefined;

    if (documents.length > limit) {
      const nextItem = documents.pop();
      nextCursor = nextItem!.id;
    }

    return {
      documents,
      nextCursor,
    };
  }),
  fetchPaginatedDocument: privateProcedure
  .input(
    z.object({
      folderId: z.string().optional(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      order: z.string().optional(),
      organizationId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { folderId, cursor, order, organizationId } = input;
    const limit = input.limit ?? 10;

    //Will throw an error if active space is null
    const data = await spaceApi.fetchActiveSpaceForUser(userId, organizationId);

    // If folderId is provided, we'll fetch documents from that folder
    const whereClause = folderId
      ? {
          folderId: folderId,
          userId: userId,
          // organizationId
        }
      : {
          spaceId: data?.id,
          userId: userId,
          // organizationId
        };
    const documents = await db.document.findMany({
      take: limit + 1, // Fetch one extra to get the next cursor
      where: whereClause,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy:
        order === "alphabetically"
          ? { title: "asc" }
          : order === "recent"
            ? { updatedAt: "desc" }
            : order === "mostViewed"
              ? { viewCount: "desc" }
              : undefined,
    });
    let nextCursor: typeof cursor | undefined = undefined;

    if (documents.length > limit) {
      const nextItem = documents.pop();
      nextCursor = nextItem!.id;
    }

    return {
      documents,
      nextCursor,
    };
  }),
  createDocument: privateProcedure
  .input(
    z.object({
      title: z.string(),
      folderId: z.string().optional(),
      spaceId: z.string(),
      promptId: z.string().optional(),
      assetFolderId: z.string().optional(),
      createdBy: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { title, folderId, spaceId, promptId, assetFolderId, createdBy } =
      input;
    const { userId } = ctx;
    const document = await db.document.create({
      data: {
        title,
        userId,
        folderId,
        spaceId,
        promptId,
        createdBy,
        // assetFolderId: isForContentGen ? assetFolderId : null,
      },
    });
    const redirectId = document.id;
    await db.document.update({
      where: { id: document.id },
      data: { redirectId },
    });
    const space = await db.workspace.findFirst({
      where: { id: spaceId },
      include: { members: true },
    });
    space &&
      Promise.all(
        space.members.map(
          async (member) =>
            member.userId !== userId &&
            (await db.document.create({
              data: {
                title,
                userId: member.userId,
                folderId,
                spaceId,
                role: ROLE.USER,
                access: member.memberRole === "VIEWER" ? "READ" : "WRITE",
                redirectId: document.id,
                createdBy: document.createdBy,
              },
            })),
        ),
      );
    return document;
  }),
  updateViewCount: privateProcedure
  .input(
    z.object({
      documentId: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { documentId } = input;

    await db.document.update({
      where: {
        id: documentId,
        userId: ctx.userId,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }),
  getAllDocuments: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
  
    const documents = await db.document.findMany({
      where: {
        userId,
      },
      include: {
        User: true,
      },
    });
  
    if (!documents) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Documents Not found",
      });
    }
  
    return documents;
  }),
  getDocument: privateProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const { id } = input;

    const document = await db.document.findUnique({
      where: {
        id,
      },
      include: {
        User: true,
      },
    });

    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document Not found",
      });
    }

    return document;
  }),
  patchDocument: privateProcedure
  .input(
    z.object({
      docId: z.string(),
      title: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { docId } = input;
    const document = await db.document.updateMany({
      where: {
        redirectId: docId,
      },
      data: {
        title: input.title,
      },
    });
    return document;
  }),
  deleteDoc: privateProcedure
  .input(
    z.object({
      docId: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const { docId } = input;

    const docs = await db.document.deleteMany({
      where: {
        redirectId: docId,
      },
    });
  }),
  toggleStarDoc: privateProcedure
  .input(
    z.object({
      id: z.string(),
      isStar: z.boolean(),
    }),
  )
  .mutation(async ({ input }) => {
    const { id, isStar } = input;

    const res = await db.document.update({
      where: {
        id,
      },
      data: { isStarred: isStar },
      select: {
        isStarred: true,
        id: true,
      },
    });
    return res;
  }),
  getDocById: privateProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const collabDoc = await db.document.findFirst({
      where: {
        redirectId: input.id,
        userId: ctx.userId,
      },
    });

    let fetchedDoc = collabDoc;
    if (!collabDoc) {
      const document = await db.document.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });

      fetchedDoc = document;
    }

    if (!fetchedDoc) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document Not found",
      });
    }

    return fetchedDoc;
  }),
  getCollaborators: privateProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const documents = db.document.findMany({
      where: { redirectId: input.id },
      include: {
        User: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });
    return documents;
  }),
  addCollaborator: privateProcedure
  .input(
    z.object({
      title: z.string(),
      redirectId: z.string(),
      collaboratorEmail: z.string(),
      access: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { title, redirectId, collaboratorEmail, access } = input;

    const fetchDoc = await db.document.findUnique({
      where: { id: redirectId },
      select: { thumbnailImageUrl: true },
    });

    if (!fetchDoc) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document Not found",
      });
    }

    const { thumbnailImageUrl } = fetchDoc;

    const user = await db.user.findFirst({
      where: { email: collaboratorEmail },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User Not found",
      });
    }

    if (user.id === ctx.userId) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Can't collaborate with self",
      });
    }

    const doc = await db.document.findFirst({
      where: { userId: user.id as string, redirectId },
    });

    if (doc) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Collaborator already added",
      });
    }

    const document = await db.document.create({
      data: {
        title,
        role: ROLE.USER,
        access: access === "WRITE" ? ACCESSTYPE.WRITE : ACCESSTYPE.READ,
        userId: user.id as string,
        redirectId,
        thumbnailImageUrl,
        createdBy: `${user.id}`,
      },
    });

    return document;
  }),
  removeCollaborator: privateProcedure
  .input(z.object({ id: z.string(), userId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { id, userId } = input;
    const doc = await db.document.deleteMany({
      where: { redirectId: id, userId: userId },
    });
  }),
  moveDocument: privateProcedure
  .input(
    z.object({
      documentId: z.string(),
      fromFolder: z.string(),
      toFolder: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { documentId, fromFolder, toFolder } = input;

    const destinationFolder = await db.folder.findUnique({
      where: {
        id: toFolder,
      },
    });

    if (!destinationFolder) {
      throw new TRPCError({
        message: "Error: Make sure the folders exists",
        code: "NOT_FOUND",
      });
    }

    const updatedDocument = await db.document.updateMany({
      where: {
        redirectId: documentId,
      },
      data: {
        folderId: destinationFolder.id,
      },
    });

    if (!updatedDocument) {
      throw new TRPCError({
        message: "Error moving document",
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    return "Success";
  }),
  toggleIsFirstOpen: privateProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const { id } = input;
    const document = await db.document.findUnique({
      where: { id },
    });
    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document not found",
      });
    }
    const res = await db.document.update({
      where: {
        id,
      },
      data: { isFirstOpen: false },
    });

    if (!res) {
      throw new TRPCError({
        message: "Error in updating database",
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    return "Success";
  }),
  createEditorBrandVoice: privateProcedure
  .input(
    z.object({
      name: z.string(),
      specialization: z.string(),
      audience: z.string(),
      purpose: z.string(),
      tone: z.array(z.string()),
      emotions: z.array(z.string()),
      character: z.array(z.string()),
      genre: z.array(z.string()),
      languageStyle: z.array(z.string()),
      brandVoice: z.string(),
    }),
  )
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

    const EditorBrandVoice = await db.editorBrandVoice.create({
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
    if (!EditorBrandVoice) {
      throw new TRPCError({
        message: "Error in creating Editor Brand Voice",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    return EditorBrandVoice;
  }),
  getEditorBrandVoices: privateProcedure.query(async ({ ctx }) => {
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
  deleteEditorBrandVoice: privateProcedure
  .input(
    z.object({
      editorBrandVoiceId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { editorBrandVoiceId } = input;

    const existingEditorBrandVoice = await db.editorBrandVoice.findFirst({
      where: {
        id: editorBrandVoiceId,
        userId: ctx.userId,
      },
    });

    if (!existingEditorBrandVoice) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "We couldn't find the brand voice you are trying to delete.",
      });
    }

    const editorBrandVoice = await db.editorBrandVoice.delete({
      where: {
        id: editorBrandVoiceId,
      },
    });
    return editorBrandVoice;
  }),
  getSelectedToolTitle: privateProcedure
  .input(
    z.object({
      documentId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { documentId } = input;
    const document = await db.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document not found",
      });
    }
    const promptId = document.promptId;

    if (!promptId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Prompt not found",
      });
    }
    const { data } = await fetchPromptByIdForContentGen(promptId);

    return data.promptTitle;
  }),
});
