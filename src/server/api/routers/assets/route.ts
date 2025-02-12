import { db } from "~/server/db";
import { addAssetsSchema } from "./schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { AssetType, FolderType, GenerationType } from "@prisma/client";
import { createTRPCRouter, privateProcedure } from "../../trpc";
import { trpc } from "~/trpc/react";

export const ASSETS_LIMIT = 100;

export const assetRouter = createTRPCRouter({
  addAIGeneratedImages: privateProcedure
  .input(
    z.object({
      images: z.array(
        z.object({
          assetKey: z.string(),
          assetType: z.nativeEnum(AssetType),
          folderType: z.nativeEnum(FolderType),
          prompt: z.string(),
          assetName: z.string(),
        }),
      ),
      workspaceId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { images, workspaceId } = input;

    const existingAssets = await db.assets.findMany({
      where: {
        workspaceId,
      },
    });

    if (existingAssets.length + images.length > ASSETS_LIMIT) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `You can only add ${ASSETS_LIMIT} assets`,
      });
    }

    const addedAssets = await Promise.all(
      images.map(async (image) => {
        const { assetKey, assetType, folderType, prompt, assetName } = image;

        if (folderType === FolderType.AI_GENERATED_IMAGE) {
          const aiFolder = await db.assetsFolder.findFirst({
            where: {
              folderType: FolderType.AI_GENERATED_IMAGE,
              spaceId: workspaceId,
            },
          });
          if (!aiFolder) {
            const createAiFolder = await db.assetsFolder.create({
              data: {
                userId: ctx.userId,
                spaceId: workspaceId,
                folderType: FolderType.AI_GENERATED_IMAGE,
                folderName: "AI Generated Images",
              },
            });
            const dataToCreate = {
              assetKey,
              userId: ctx.userId,
              assetType,
              workspaceId,
              assetName,
              folderId: createAiFolder.id,
              prompt: prompt,
            };
            console.log("Data to Create", dataToCreate);
            return await db.assets.create({
              data: dataToCreate,
            });
          }
        }
      }),
    );
    if (addedAssets.length === 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No assets added",
      });
    }
    return addedAssets? addedAssets : null;
  }),
  addAssets: privateProcedure
  .input(addAssetsSchema)
  .mutation(async ({ input, ctx }) => {
    const { assets, workspaceId } = input;
    console.log("TRPC Assets", assets);
    const existingAssets = await db.assets.findMany({
      where: {
        workspaceId: workspaceId,
        userId: ctx.userId,
      },
    });
    if (existingAssets.length + assets.length > ASSETS_LIMIT) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `You can only add ${ASSETS_LIMIT} assets`,
      });
    }

    const addedAssets = await Promise.all(
      assets.map(async (asset) => {
        const { assetKey, assetType, folderId, folderType, prompt } = asset;

        if (folderType === FolderType.AI_GENERATED_IMAGE) {
          const aiFolder = await db.assetsFolder.findFirst({
            where: {
              folderType: FolderType.AI_GENERATED_IMAGE,
              spaceId: workspaceId,
            },
          });
          if (!aiFolder) {
            const createAiFolder = await db.assetsFolder.create({
              data: {
                userId: ctx.userId,
                spaceId: workspaceId,
                folderType: FolderType.AI_GENERATED_IMAGE,
                folderName: "AI Generated Images",
              },
            });
            const dataToCreate = {
              assetKey,
              userId: ctx.userId,
              assetType,
              workspaceId,
              assetName: asset.assetName,
              folderId: createAiFolder.id,
              prompt: prompt,
            };
            console.log("Data to Create", dataToCreate);
            return await db.assets.create({
              data: dataToCreate,
            });
          }
        }
        return await db.assets.create({
          data: {
            assetKey,
            userId: ctx.userId,
            assetType,
            workspaceId,
            assetName: asset.assetName,
            folderId: folderId ? folderId : "",
          },
        });
      }),
    );
    if (addedAssets.length === 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No assets added",
      });
    }
    return addedAssets? addedAssets : null;
  }),

  getAssets: privateProcedure
  .input(
    z.object({
      folderId: z.string().optional(),
      cursor: z.string().nullish(),
      workSpaceId: z.string(),
      searchTerm: z.string().optional(),
      onlyImages: z.boolean().optional(),
      assetType: z.nativeEnum(AssetType).optional(),
      folderType: z.nativeEnum(FolderType).optional(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const LIMIT = 10;
    const {
      cursor,
      workSpaceId,
      searchTerm,
      onlyImages,
      assetType,
      folderId,
      folderType,
    } = input;
    let newFolderId = folderId;
    if (folderType === "AI_GENERATED_IMAGE") {
      const aiFolder = await db.assetsFolder.findFirst({
        where: {
          folderType: "AI_GENERATED_IMAGE",
          spaceId: workSpaceId,
        },
      });
      if (!aiFolder) {
        return { assets: [], nextCursor: undefined };
      }
      newFolderId = aiFolder.id;
      console.log("New Folder ID", newFolderId);
    }
    const whereClause: any = {
      // userId: ctx.userId,
      folderId: newFolderId,
      workspaceId: workSpaceId,
      assetType: onlyImages ? "IMAGE" : assetType ? assetType : undefined,
      assetName: {
        contains: searchTerm,
        mode: "insensitive",
      },
    };
    console.log("Where Clause", whereClause);
    const assets = await db.assets.findMany({
      where: whereClause,

      take: LIMIT + 1, // Fetch one extra to get the next cursor
      cursor: cursor ? { id: cursor } : undefined,
    });
    let nextCursor: typeof cursor | undefined = undefined;

    if (assets.length > LIMIT) {
      const nextItem = assets.pop();
      nextCursor = nextItem!.id;
    }
    console.log("Assets in TRPC", assets);
    return { assets, nextCursor };
  }),
  getAssetCount: privateProcedure
  .input(
    z.object({
      workSpaceId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { workSpaceId } = input;
    const assetCount = await db.assets.count({
      where: {
        userId: ctx.userId,
        workspaceId: workSpaceId,
      },
    });

    return assetCount? assetCount : null;
  }),

  deleteAsset: privateProcedure
  .input(
    z.object({
      assetKey: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { assetKey } = input;
    const asset = await db.assets.findFirst({
      where: {
        assetKey: assetKey,
        userId: ctx.userId,
      },
    });
    if (!asset) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Asset not found",
      });
    }
    const deletedAsset = await db.assets.delete({
      where: {
        assetKey: assetKey,
        userId: ctx.userId,
      },
    });

    return deletedAsset;
  }),

  getAllFolders: privateProcedure
  .input(
    z.object({
      workSpaceId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { workSpaceId } = input;
    const folders = await db.assetsFolder.findMany({
      where: {
        userId: ctx.userId,
        spaceId: workSpaceId,
      },
    });
    return folders;
  }),

  createFolder: privateProcedure
  .input(
    z.object({
      workSpaceId: z.string(),
      folderName: z.string(),
    }),
  )

  .mutation(async ({ input, ctx }) => {
    const { workSpaceId, folderName } = input;
    const existingFolder = await db.assetsFolder.findFirst({
      where: {
        userId: ctx.userId,
        spaceId: workSpaceId,
        folderName,
      },
    });
    if (existingFolder) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Folder already exists",
      });
    }

    const folder = await db.assetsFolder.create({
      data: {
        userId: ctx.userId,
        spaceId: workSpaceId,
        folderName,
      },
    });
    return folder? folder : null;
  }),
  getFilesInFolder: privateProcedure
  .input(
    z.object({
      folderId: z.string(),
      workspaceId: z.string(),
      assetType: z.nativeEnum(AssetType).optional(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { folderId, workspaceId, assetType } = input;
    const files = await db.assets.findMany({
      where: {
        folderId,
        workspaceId,
        assetType: assetType ? assetType : undefined,
      },
    });
    return files? files : null;
  }),

  getFolderDetails: privateProcedure
  .input(
    z.object({
      folderId: z.string(),
      workSpaceId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { folderId, workSpaceId } = input;
    const folder = await db.assetsFolder.findFirst({
      where: {
        id: folderId,
        spaceId: workSpaceId,
      },
    });
    return folder? folder : null;
  }),

  updateFolderName:privateProcedure
  .input(
    z.object({
      folderId: z.string(),
      folderName: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { folderId, folderName } = input;
    const folder = await db.assetsFolder.update({
      where: {
        id: folderId,
      },
      data: {
        folderName,
      },
    });
    return folder? folder : null;
  }),

  generatedDocsInFolder: privateProcedure
  .input(
    z.object({
      assetFolderId: z.string(),
      workspaceId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { assetFolderId, workspaceId } = input;
    const docs = await db.document.findMany({
      where: {
        assetFolderId,
        spaceId: workspaceId,
      },
    });
    return docs ? docs : null;
  }),

  getAllMediaAssets: privateProcedure.query(async ({ ctx }) => {
    // Fetch images data
    const images = await db.imageData.findMany({
      where: {
        userId: ctx.userId,
      },
      include: {
        User: {
          select: {
            name: true,
            image: true,
          },
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  
    // fetch audio data
    const audio = await db.audioModel.findMany({
      where: {
        userId: ctx.userId,
      },
      include: {
        User: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  
    return { images, audio };
  }),

  deleteMediaAsset: privateProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { id } = input;
    const asset = await db.imageData.findUnique({
      where: {
        id: id,
        userId: ctx.userId,
      },
    });
    if (!asset) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Asset not found",
      });
    }

    const response = await db.imageData.delete({
      where: {
        id: id,
        userId: ctx.userId,
      },
    });
    if (!response) {
      throw new TRPCError({
        message: "Error in deleting asset",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    return response;
  }),

  addMediaImageAsset: privateProcedure
  .input(
    z.object({
      imageKey: z.string(),
      workspaceId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { imageKey, workspaceId } = input;

    // Create a new image asset with only the essential fields
    const newImage = await db.imageData.create({
      data: {
        imageKey: imageKey,
        userId: ctx.userId,
        workspaceId: workspaceId,
        imageUrl: imageKey,
        generationType: GenerationType.USER_ADDED,
        prompt: ""
      }
    });

    return newImage;
  }),

  addMediaAudioAsset: privateProcedure
  .input(
    z.object({
      audioKey: z.string(),
      text: z.string(),
      workspaceId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { audioKey, text, workspaceId } = input;

    // Create a new audio asset with only the essential fields
    const newAudio = await db.audioModel.create({
      data: {
        audioKey: audioKey,
        text,
        userId: ctx.userId,
        workspaceId: workspaceId,
      },
      select: {
        id: true,
        audioKey: true,
        text: true,
        createdAt: true,
      },
    });

    return newAudio;
  }),

  deleteMediaAudioAsset: privateProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { id } = input;
    const asset = await db.audioModel.findUnique({
      where: {
        id: id,
        userId: ctx.userId,
      },
    });
    if (!asset) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Asset not found",
      });
    }

    const response = await db.audioModel.delete({
      where: {
        id: id,
        userId: ctx.userId,
      },
    });
    if (!response) {
      throw new TRPCError({
        message: "Error in deleting asset",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    return response;
  }),

  getProjectAudioDocs: privateProcedure
  .input(
    z.object({
      workspaceId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const docs = await db.audioProject.findMany({
      where: {
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        type: true,
        createdBy: true,
        processStatus: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return docs;
  }),

  deleteProjectAudio: privateProcedure
  .input(
    z.object({
      audioProjectId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { audioProjectId } = input;
    const deleteProject = await db.audioProject.delete({
      where: {
        id: audioProjectId,
      },
    });
    return deleteProject;
  }),

getProjectDocuments: privateProcedure
  .input(
    z.object({
      workspaceId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const docs = await db.document.findMany({
      where: {
        spaceId: input.workspaceId,
      },
      select: {
        id: true,
        title: true,
        role: true,
        access: true,
        createdAt: true,
        createdBy: true,
        viewCount: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return docs;
  }),

  deleteProjectDocument:privateProcedure
  .input(
    z.object({
      documentId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { documentId } = input;
    const deleteProject = await db.document.delete({
      where: {
        id: documentId,
      },
    });
    return deleteProject;
  }),

  getProjectVideos:privateProcedure
  .input(
    z.object({
      workspaceId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const docs = await db.videoModel.findMany({
      where: {
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        videoType: true,
        processStatus: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return docs;
  }),

  deleteProjectVideo: privateProcedure
  .input(
    z.object({
      videoId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { videoId } = input;
    const deleteProject = await db.videoModel.delete({
      where: {
        id: videoId,
      },
    });
    return deleteProject;
  }),

  deleteMultipleMediaAssets: privateProcedure
  .input(
    z.object({
      assetIds: z.array(z.string()),
      type: z.enum(["audio", "image"]),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { assetIds, type } = input;

    // console.log("Asset IDs:", assetIds);

    if (type === "audio") {
      const response = await db.audioModel.deleteMany({
        where: {
          id: {
            in: assetIds,
          },
          userId: ctx.userId,
        },
      });
      return response;
    } else {
      const response = await db.imageData.deleteMany({
        where: {
          id: {
            in: assetIds,
          },
          userId: ctx.userId,
        },
      });

      // console.log("Response:", response);

      return response;
    }
  }),

  deleteMultipleProjectDocuments: privateProcedure
  .input(
    z.object({
      documentIds: z.array(z.string()),
      type: z.enum(["audio", "video", "docs"]),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { documentIds, type } = input;
    if (type === "docs") {
      const response = await db.document.deleteMany({
        where: {
          id: {
            in: documentIds,
          },
        },
      });
      return response;
    } else if (type === "audio") {
      const response = await db.audioProject.deleteMany({
        where: {
          id: {
            in: documentIds,
          },
        },
      });
      return response;
    } else {
      const response = await db.videoModel.deleteMany({
        where: {
          id: {
            in: documentIds,
          },
        },
      });
      return response;
    }
  }),

  mediaRouter: privateProcedure
  .input(
    z.object({
      keys: z.array(z.string()),
      type: z.enum(["audio", "image"]),
    }),
  )
  .query(async ({ input }) => {
    const urls = await Promise.all(input.keys.map((key) => trpc.aws.getObjectURL.useQuery({ key })));
    return urls;
  }),

});
