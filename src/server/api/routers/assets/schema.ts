import { AssetType, FolderType } from "@prisma/client";
import { z } from "zod";

// Define the schema for individual assets
export const AssetZodSchema = z.object({
  assetKey: z.string(),
  assetName: z.string().optional(),
  assetType: z.nativeEnum(AssetType),
  folderId: z.string().optional(),
  folderType : z.nativeEnum(FolderType).optional(),
  prompt: z.string().optional(),
});

// Define the schema for the array of assets
export const addAssetsSchema = z.object({
  workspaceId: z.string(),
  assets: z.array(AssetZodSchema), // Reference to the individual asset schema
});

// Define the types
export type Asset = z.infer<typeof AssetZodSchema>;
export type AssetsSchema = z.infer<typeof addAssetsSchema>;
