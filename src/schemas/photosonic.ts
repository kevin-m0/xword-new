import { z } from 'zod';
import { RatioOption, ResolutionOption, StyleOption } from '~/types/photosonic.types';

export const PhotoSonicFormSchema = z.object({
  ratio: z.custom<RatioOption>(),
  resolution: z.custom<ResolutionOption>(),
  style: z.custom<StyleOption>(),
  numberOfOutputs: z.number().min(1).max(4),
  range: z.number().min(0).max(10).optional(),
  seed: z.string().optional(),
  negativePrompt: z.string().max(1000).optional(),
  prompt: z.string()
    .min(3, { message: "Prompt must be at least 3 characters" })
    .max(1000, { message: "Prompt must be less than 1000 characters" })
    .refine((val) => val.trim().length > 0, { message: "Prompt cannot be empty" }),
});