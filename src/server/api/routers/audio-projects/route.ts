import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { audioProjectSchema } from "./schema";
import axios from "axios";
import { createTRPCRouter, privateProcedure } from "../../trpc";


export const audioProjectsRouter = createTRPCRouter({
  createAudioProject: privateProcedure
  .input(audioProjectSchema)
  .mutation(async ({ input }) => {
    const data = {
      ...input,
    };
    const res = await db.audioProject.create({ data: { ...data } });
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

  getAudioProjectMetadata: privateProcedure
  .input(
    z.object({
      url: z.string(),
      type: z.enum(["file", "youtube"]),
      languagecode: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
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
        message: `Failed to handle transcription: ${error}`,
      });
    }
  }),

  getAudioProjectById: privateProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ input }) => {
    try {
      const res = await db.audioProject.findUnique({
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

})