import { z } from "zod";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { db } from "~/server/db";
import { videoModelSchema, viralClipModelSchema } from "./schema";
import { createTRPCRouter, privateProcedure } from "../../trpc";
import { getRelatedKeyword } from "~/utils/utils";
import { handlePexelsImageFetch, handlePexelsVideoFetch } from "~/utils/pexels-utility";


export const videoProjectsRouter = createTRPCRouter({
  createVideoProject: privateProcedure
  .input(videoModelSchema)
  .mutation(async ({ input }) => {
    const data = {
      ...input,
    };
    const res = await db.videoModel.create({ data: { ...data } });
    if (!res) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return res;
  }),
  getVideoMetadata: privateProcedure
  .input(
    z.object({
      url: z.string(),
      type: z.enum(["mux", "youtube"]),
      languagecode: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const payload = {
      url: input.url,
      type: input.type,
      languagecode: input.languagecode,
    };
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/generate-all`,
        payload,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get video metadata ${error}`,
      });
    }
  }),

  getVideoMetadataMutation: privateProcedure
  .input(
    z.object({
      url: z.string(),
      type: z.enum(["mux", "youtube"]),
      languagecode: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const payload = {
      url: input.url,
      type: input.type,
      languagecode: input.languagecode,
    };

    console.log(payload, "Payload");

    try {
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await delay(10000);
      const res = await axios.post(
        `https://llm-microservice-staging.up.railway.app/generate/generate-all`, // Using your Swagger endpoint directly
        payload,
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`, // Ensure this matches the token from your curl command
          },
        },
      );

      return res.data;
    } catch (error: any) {
      console.error("Error response:", error.response?.data || error.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get video metadata: ${
          error.response?.data?.message || error.message
        }`,
      });
    }
  }),

  createViralClip: privateProcedure
  .input(viralClipModelSchema)
  .mutation(async ({ input }) => {
    try {
      const res = await db.viralClips.create({
        data: {
          title: input.title,
          workspaceId: input.workspaceId,
          description: input.description,
          processStatus: "PROCESSING",
          words: input.words,
          parentVideoId: input.parentVideoId,
          transcript: input.transcript,
          subtitles: input.subtitles,
          thumbnailUrl: input.thumbnailUrl,
          videoUrl: input.videoUrl,
          duration: input.duration,
        },
      });

      return res;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to create prompt: ${error}`,
      });
    }
  }),

  getVideoProjectById: privateProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ input }) => {
    try {
      const res = await db.videoModel.findUnique({
        where: {
          id: input.id,
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
  getAllVideoProjects: privateProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ input }) => {
    try {
      const res = await db.videoModel.findMany({
        where: {
          workspaceId: input.id,
        },
        include: {
          createdByUser: true,
        },
      });

      console.log(res, 'video projects')

      return res;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch prompt by ID: ${error}`,
      });
    }
  }),

  audiogramGen: privateProcedure
  .input(
    z.object({
      audioUrl: z.string(), // Audio URL input
      // imageUrl: z.string(), // Background image URL input
    }),
  )
  .mutation(async ({ input }) => {
    console.log("Received input:", input);
  }),

  brollsCreation: privateProcedure
  .input(
    z.object({
      selectedText: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      const { selectedText } = input;

      try {
        // get video from pexels and trimmed according to duration
        const keyword: string = await getRelatedKeyword(selectedText);
        const stockVideo = await handlePexelsVideoFetch(keyword);

        return {
          success: true,
          outputFile: stockVideo,
        };
      } catch (error) {
        console.error("Pexel Error", error);
        throw error;
      }
    } catch (error) {
      console.error("Outer error:", error);
      throw error;
    }
  }),

  imageBrollsCreation: privateProcedure
  .input(
    z.object({
      selectedText: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const { selectedText } = input;

      try {
        // get video from pexels and trimmed according to duration
        const keyword: string = await getRelatedKeyword(selectedText);
        const stockImage = await handlePexelsImageFetch(keyword);

        return {
          success: true,
          outputFile: stockImage,
        };
      } catch (error) {
        console.error("Pexel Error", error);
        throw error;
      }
    } catch (error) {
      console.error("Outer error:", error);
      throw error;
    }
  }),

  AIimageBrollsCreation: privateProcedure
  .input(
    z.object({
      userPrompt: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const { userPrompt } = input;
      const payload = {
        text: userPrompt,
      };

      console.log(payload);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/generate-image-clip`,
        payload,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get video metadata ${error}`,
      });
    }
  }),

  generateViralClipTimestamps: privateProcedure
  .input(
    z.object({
      url: z.string(),
      type: z.enum(["mux", "youtube"]),
    }),
  )
  .query(async ({ input }) => {
    const payload = {
      url: input.url,
      type: input.type,
    };
    try {
      console.log(payload, "payload");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/generate-viral-clips`,
        payload,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
          },
        },
      );
      console.log(res.data);
      return res.data.viralClips;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to generate viral clips: ${error}`,
      });
    }
  }),

  getViralClips: privateProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const res = await db.viralClips.findMany({
      where: {
        parentVideoId: input.id,
      },
    });

    return res;
  }),

  getViralClipById: privateProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ input }) => {
    try {
      const res = await db.viralClips.findUnique({
        where: {
          id: input.id,
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

  saveVideoProjectState: privateProcedure
  .input(z.object({ id: z.string(), projectState: z.string() }))
  .mutation(async ({ input }) => {
    const res = await db.videoModel.update({
      where: {
        id: input.id,
      },
      data: {
        projectState: input.projectState,
      },
    });

    return res;
  }),

  updateVideoProjectTitle: privateProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const res = await db.videoModel.update({
      where: {
        id: input.id,
      },
      data: {
        title: input.title,
      },
    });

    return res;
  }),

  updateVideoProjectDescription: privateProcedure
  .input(
    z.object({
      id: z.string(),
      description: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const res = await db.videoModel.update({
      where: {
        id: input.id,
      },
      data: {
        description: input.description,
      },
    });

    return res;
  }),

  deleteVideoProject: privateProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      const res = await db.videoModel.delete({
        where: {
          id: input.id,
        },
      });

      return res;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to delete video project: ${error}`,
      });
    }
  }),

})