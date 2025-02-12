import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "~/server/db";
import { createTRPCRouter, privateProcedure } from "../../trpc";


export const audioRouter = createTRPCRouter({
  createAudioScript: privateProcedure
  .input(
    z.object({
      scriptTitle: z.string(),
      scriptTopic: z.string(),
      scriptAudiofile: z.string(),
      audioModels: z.array(
        z.object({
          text: z.string(),
          persona: z.string().optional().nullable(),
          personaId: z.string().optional().nullable(),
          storageKey: z.string(),
          emotion: z.string().optional().nullable(),
          speed: z.string().optional().nullable(),
        })
      ),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { scriptTitle, scriptTopic, scriptAudiofile, audioModels } = input;

    const audioScript = await db.audioScript.create({
      data: {
        title: scriptTitle,
        topic: scriptTopic,
        finalKey: scriptAudiofile,
        userId: ctx.userId,
      },
    });

    await db.audioModel.createMany({
      data: audioModels.map((audioModel) => ({
        text: audioModel.text,
        persona: audioModel.persona,
        personaId: audioModel.personaId,
        emotion: audioModel.emotion,
        speed: audioModel.speed as any,
        storageKey: audioModel.storageKey,
        audioScriptId: audioScript.id,
        userId: ctx.userId,
        audioKey: audioModel.storageKey,
      })),
    });
  }),

  createAudioModel: privateProcedure
  .input(
    z.object({
      text: z.string(),
      audioKey: z.string(),
      workspaceId: z.string(),
      persona: z.string(),
      personaId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { text, audioKey, workspaceId, persona, personaId } = input;

    const newScript = await db.audioScript.create({
      data: {
        title: text.slice(0, 25),
        topic: text,
        finalKey: audioKey,
        userId: ctx.userId,
      },
    });

    await db.audioModel.create({
      data: {
        text: text,
        audioKey: audioKey,
        audioScriptId: newScript.id,
        userId: ctx.userId,
        workspaceId,
        persona,
        personaId,
      },
    });
  }),

  getAudioScripts: privateProcedure.query(async ({ ctx }) => {
    const audioScripts = await db.audioScript.findMany({
      include: {
        audioModels: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  
    return audioScripts;
  }),

  getAudioRecords: privateProcedure
  .input(
    z.object({
      workspaceId: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    const audioRecords = await db.audioModel.findMany({
      where: {
        workspaceId: input.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return audioRecords;
  }),

  getVoiceModels: privateProcedure
  .input(
    z.object({
      language: z.string(),
      country: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { language, country } = input;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/audio/get-available-voice-models?language=${language}&country=${country}`,
      {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
      }
    );

    const data = await res.json();

    return data;
  }),

  getAllVoices: privateProcedure
  .query(async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/audio/list-all-voices`,
      {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch voices");
    }

    const voices = (await response.json());
    return voices;
  }),

  getUserVoices: privateProcedure
  .query(async ({ ctx }) => {
    const userVoices = await db.userVoice.findMany({
      where: { userId: ctx.userId },
    });
    return userVoices;
  }),

createUserVoice: privateProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      audioFileKey: z.string(),
      voiceId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { name, description, audioFileKey, voiceId } = input;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/audio/create-voice`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
        body: JSON.stringify({
          name,
          description,
          audioFileKey,
          voiceId,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new TRPCError({ code: 'BAD_REQUEST', message: `Failed to create voice, please try again later.` });
    }

    const data = await response.json();
    const { id } = data;

    const userVoice = await db.userVoice.create({
      data: {
        name,
        description,
        audioFileKey,
        voiceId: id,
        userId: ctx.userId,
      },
    });

    return userVoice;
  }),

  deleteUserVoice: privateProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const voice = await db.userVoice.findUnique({ where: { id: input.id }, })
    if (!voice || voice.userId !== ctx.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }
    try {
      await deleteVoiceFromExternalService(voice.voiceId);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to delete voice from all voices"
      });
    }

    await db.userVoice.delete({ where: { id: input.id }, });
    return { success: true };
  }),

  getLanguageModels: privateProcedure.query(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/audio/get-languages`,
      {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
      }
    );
  
    const data = await res.json();
  
    return data ;
  }),

  getEmotions: privateProcedure.query(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/audio/get-available-voice-emotions`,
      {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
      }
    );
  
    const data = await res.json();
  
    return data;
  }),

  editAudioScript: privateProcedure
  .input(
    z.object({
      scriptId: z.string(),
      title: z.string(),
      finalKey: z.string(),
      topic: z.string(),
      audioModels: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
          persona: z.string().optional().nullable(),
          personaId: z.string().optional().nullable(),
          audioKey: z.string(),
          emotion: z.string().optional().nullable(),
          speed: z.string(),
        })
      ),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { title, topic, finalKey, scriptId, audioModels } = input;

    const existingScript = await db.audioScript.findFirst({
      where: { id: scriptId },
      select: { id: true },
    });

    if (!existingScript) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "We couldn't find the script you are trying to edit.",
      });
    }

    await db.audioScript.update({
      where: { id: scriptId },
      data: {
        title,
        topic,
        finalKey,
        userId: ctx.userId,
      },
    });

    // Update each audio model individually
    for (const audioModel of audioModels) {
      await db.audioModel.update({
        where: { id: audioModel.id },
        data: {
          text: audioModel.text,
          persona: audioModel.persona,
          personaId: audioModel.personaId,
          emotion: audioModel.emotion,
          speed: audioModel.speed as any,
          audioKey: audioModel.audioKey
        }
      });
    }
  }),

  deleteAudioScript: privateProcedure
  .input(
    z.object({
      scriptId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { scriptId } = input;

    const existingScript = await db.audioScript.findFirst({
      where: { id: scriptId, userId: ctx.userId },
      select: { id: true },
    });

    if (!existingScript) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "We couldn't find the script you are trying to delete.",
      });
    }

    await db.audioScript.delete({
      where: { id: scriptId, userId: ctx.userId },
    });
  }),

  deleteAudioModel: privateProcedure
  .input(
    z.object({
      modelId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { modelId } = input;

    const existingAudioModel = await db.audioModel.findFirst({
      where: { id: modelId, userId: ctx.userId },
      select: { id: true },
    });

    if (!existingAudioModel) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "We couldn't find the model you are trying to edit.",
      });
    }

    await db.audioModel.delete({
      where: { id: modelId, userId: ctx.userId },
    });
  }),

  deleteAudioRecord: privateProcedure
  .input(
    z.object({
      audioRecordId: z.string(),
      workspaceId: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { audioRecordId, workspaceId } = input;

    const existingAudioModel = await db.audioModel.findFirst({
      where: { id: audioRecordId, userId: ctx.userId },
      select: { id: true },
    });

    if (!existingAudioModel) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "We couldn't find the model you are trying to delete.",
      });
    }

    const audio = await db.audioModel.delete({
      where: {
        id: audioRecordId,
        workspaceId,
      },
    });

    return audio;
  }),

  getFileTranscription: privateProcedure
  .input(
    z.object({
      url: z.string().url(),
      type: z.string(),
      languagecode: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { url, type, languagecode } = input;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/handle-transcription`,
      {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHRyYjE1MXYwMDAwZXNlMmFmb2VsMnoxIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE3MTA0OTIwNzl9.ObDtBsSd1uLgh8dOnzPktdaMINtgG-IM2Uhq70qz7i8",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, type, languagecode }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch transcription: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  })

});

async function deleteVoiceFromExternalService(voiceId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/audio/delete-voice`,
    {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
      },
      body: JSON.stringify({ voiceId }),
    });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete voice: ${errorText}`);
  }

  return response.json();
}