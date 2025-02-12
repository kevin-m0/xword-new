import { z } from "zod";
import { GenerationType } from "@prisma/client";
const GenerationEnum = z.nativeEnum(GenerationType);

export const createImageRecordSchema = z.object({
  imageKey: z.array(z.object({ file: z.string() })).optional(),
  imageSrc: z.string().optional(),
  prompt: z.string(),
  generationType: GenerationEnum,
  imageId: z.string().optional(),
  workspaceId: z.string().optional(),
});

const AssetSchema = z.object({
  prompt: z.string(),
  imageKey: z.string(),
});

const AssetsSchema = z.array(AssetSchema);

export const createAssetsSchema = z.object({
  workspaceId: z.string().optional(),
  assets: AssetsSchema,
});

export type AssetType = {
  prompt: string;
  imageKey: string;
  workspaceId?: string;
  userId?: string;
  generationType: GenerationType;
};

export type Asset = z.infer<typeof AssetSchema>;
export type CreateAsset = z.infer<typeof createAssetsSchema>;
