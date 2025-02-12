import { z } from "zod";
import axios from "axios";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../../trpc";

export const flowRouter = createTRPCRouter({
    fetchFlowPrompts: privateProcedure.query(async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/get-all-single-campaign-prompts`,
                {
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",  
                message: "Failed to fetch flow",
            });
        }
    }),
    fetchSinglePrompt: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/get-single-campaign-prompt-by-id?promptId=${input.id}`,
                {
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch flow",
            });
        }
    }),
    getAllMultiCampaigns: privateProcedure
    .query(async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/get-all-multicampaign-prompts`,
                {
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
                    },
                },
            );
            return response.data;
        }
        catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch flow",
            });
        }
    }),
    generateMultiCampaign: privateProcedure
    .input(
        z.object({
            payload: z.object({
                userId: z.string(),
                promptId: z.array(z.string()),
                responses: z.object({
                    text: z.string(),
                    params: z.object({
                        tones: z.string(),
                        "Who is the target audience for this": z.string(),
                        "Desired length of content": z.string(),
                    }),
                }),
            }),
        })
    )
    .mutation(async ({ input }) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/generate-multi-campaign`,
                JSON.stringify(input.payload),
                {
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
                    },
                },
            );

            return response.data;
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch flow",
            });
        }
    }),
})