import { z } from "zod";
import axios from "axios";
import { GenerationType, ImageData, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { createImageRecordSchema } from "./schema";
import { createAssetsSchema, AssetType } from "./schema";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { TagRoutes } from "~/lib/photosonic";
import { createTRPCRouter, privateProcedure } from "../../trpc";
const GenerationEnum = z.nativeEnum(GenerationType);

const Bucket = process.env.S3_BUCKET_NAME;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_FILE_UPLOAD_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_FILE_UPLOAD_SECRET_KEY as string,
  },
});

export const imageRouter = createTRPCRouter({
  createImageRecord: privateProcedure
  .input(createImageRecordSchema)
  .mutation(async ({ input, ctx }) => {
    const { imageKey, prompt, imageSrc, workspaceId } = input;
    const addedImages: ImageData[] = [];
    if (imageKey) {
      await Promise.all(
        imageKey.map(async (image) => {
          const { file } = image;

          const img = await db.imageData.create({
            data: {
              imageKey: file,
              userId: ctx.userId,
              prompt,
              generationType: input.generationType,
              workspaceId,
            },
          });

          addedImages.push(img);
        }),
      );
    } else {
      const img = await db.imageData.create({
        data: {
          imageUrl: imageSrc,
          userId: ctx.userId,
          prompt,
          generationType: input.generationType,
          workspaceId,
          imageKey: input?.imageKey?.[0]?.file as string,
        },
      });

      addedImages.push(img);
    }

    return addedImages;
  }),
  getImageRecords: privateProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      generationType: GenerationEnum,
      workspaceId: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    const { limit, cursor, generationType, workspaceId } = input;
    const formattedLimit = limit ?? 4;
    const imageRecords = await db.imageData.findMany({
      where: {
        workspaceId,
        generationType,
      },
      take: formattedLimit + 1, // Fetch one extra to get the next cursor
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;

    if (imageRecords.length > formattedLimit) {
      const nextItem = imageRecords.pop();
      nextCursor = nextItem!.id;
    }

    return { imageRecords, nextCursor };
  }), 
  deleteImage: privateProcedure
  .input(
    z.object({
      imageRecordId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { imageRecordId } = input;

    const existingImageRecord = await db.imageData.findFirst({
      where: {
        id: imageRecordId,
        userId: ctx.userId,
      },
    });

    if (!existingImageRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "We couldn't find the image you are trying to delete. Please try again.",
      });
    }

    const imageData = await db.imageData.delete({
      where: {
        id: imageRecordId,
        userId: ctx.userId,
      },
      select: {
        imageKey: true,
      },
    });

    return imageData;
  }),

  getPopularTags: privateProcedure.query(async ({ ctx }) => {
    const payload = { userId: ctx.userId };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/image/popular-tags`,
      payload,
      {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
      },
    );
  
    return res.data.topics as string[];
  }),
  getImageTags: privateProcedure
  .input(
    z.object({
      tagType: z.enum(["artists", "moods"]),
    }),
  )
  .query(async ({ input }) => {
    const tagRoute = TagRoutes[input.tagType];

    const res = await fetch(
      // `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/image${tagRoute}`,
      `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/image/${tagRoute}`,
      {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization:
            // "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
            "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
      },
    );

    const data = await res.json();

    return data as string[];
  }),
  getArtStyles: privateProcedure.query(async ({ input }) => {
    const res = await fetch(
      // `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/image/get-artstyles`,
      `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/image/get-artstyles`,
      {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization:
            // "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
            "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
      },
    );
  
    const data = await res.json();
  
    return data as string[];
  }),
  getImagetAssets: privateProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      searchTerm: z.string(),
      userIds: z.array(z.string()),
      workspaceId: z.string(),
      types: z.array(z.string().optional()),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { limit, cursor, searchTerm, workspaceId, userIds, types } = input;
    const formattedLimit = limit ?? 4;

    let whereClause: Prisma.ImageDataWhereInput = {
      workspaceId,
      userId: { in: userIds },
      // Add type filtering if specified
      ...(types &&
        types.length > 0 && {
        OR: types.map((type) => ({
          imageKey: {
            startsWith: `${type}_`,
          },
        })),
      }),
      ...(searchTerm && {
        prompt: {
          contains: searchTerm,
          mode: "insensitive" as Prisma.QueryMode,
        },
      }),
    };

    const imageRecords = await db.imageData.findMany({
      where: whereClause,
      take: formattedLimit + 1, // Fetch one extra to get the next cursor
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;

    if (imageRecords.length > formattedLimit) {
      const nextItem = imageRecords.pop();
      nextCursor = nextItem!.id;
    }

    return { imageRecords, nextCursor };
  }),
  createAssets: privateProcedure
  .input(createAssetsSchema)
  .mutation(async ({ input, ctx }) => {
    const { assets, workspaceId } = input;
    const data: AssetType[] = assets.map((asset) => ({
      ...asset,
      workspaceId,
      userId: ctx.userId,
      generationType: GenerationType.USER_ADDED,
    }));
    const res = await db.imageData.createMany({ data });
    if (!res) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return res;
  }),

  storeGeneratedImage: privateProcedure
  .input(
    z.object({
      imageKey: z.string(),
      prompt: z.string(),
      generationType: z.nativeEnum(GenerationType),
      workspaceId: z.string(),
      resolution: z.string().default(""),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { imageKey, prompt, generationType, workspaceId, resolution } = input;
    try {
      const imageData = await db.imageData.create({
        data: {
          imageKey,
          prompt,
          generationType,
          userId: ctx.userId,
          workspaceId,
        },
      });
      return imageData;
    } catch (error) {
      console.error("Error storing generated image:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to store generated image",
      });
    }
  }),
  getGeneratedImages: privateProcedure
  .input(
    z.object({
      workspaceId: z.string(),
      generationType: z.nativeEnum(GenerationType).optional(),
      cursor: z.string().nullish(),
      limit: z.number().min(1).max(100).default(10),
    })
  )
  .query(async ({ ctx, input }) => {
    const { workspaceId } = input;
    try {
      const images = await db.imageData.findMany({
        where: {
          userId: ctx.userId,
          workspaceId,
          ...(GenerationType && { GenerationType }),
        },
      });
      return images;
    } catch (error) {
      console.error("Error fetching generated images:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch generated images",
      });
    }
  }),
  getGeneratedImagesWithUrls: privateProcedure
  .input(
    z.object({
      workspaceId: z.string(),
      generationType: z.nativeEnum(GenerationType).optional(),
      cursor: z.string().nullish(),
      limit: z.number().min(1).max(100).default(10),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { workspaceId, generationType, cursor, limit } = input;

    try {
      const images = await db.imageData.findMany({
        where: {
          userId: ctx.userId,
          workspaceId,
          ...(generationType && { generationType }),
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Generate signed URLs for the images in parallel
      const signedUrls = await Promise.all(
        images.map(async (image) => {
          const key = image.imageKey?.split("/").pop()?.replace(".png", "") || "";
          const command = new GetObjectCommand({ Bucket, Key: key });
          const url = await getSignedUrl(s3, command);
          // console.log("url--->", url);
          return { ...image, imageUrl: url };
        }),
      );

      return {
        images: signedUrls,
        nextCursor: images.length === limit ? images?.[images.length - 1]?.id : null, // For pagination
      };
    } catch (error) {
      console.error("Error fetching generated images with URLs:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch generated images",
      });
    }
  }),

  deleteGeneratedImage: privateProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    try {
      await db.imageData.delete({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete image",
      });
    }
  }),
})