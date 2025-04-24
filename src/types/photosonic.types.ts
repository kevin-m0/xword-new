import { z } from 'zod';
import { PhotoSonicFormSchema } from '~/schemas/photosonic';

export type TabType = 'simple' | 'advance';

export type RatioOption = "Widescreen (16:9)" | "Square (1:1)" | "Mobile vertical (9:16)" | "Landscape (3:2)" | "Portrait (4:5)";
export type ResolutionOption = "720p" | "2K";
export type StyleOption = "None" | "3D Cartoon" | "3D Render" | "35mm" | "80s Vaporwave" | "Abandoned" | "Abstract Sculpture" | "Advertising" | "Anime" | "Architectural";

export interface PhotoSonicFormValues {
  ratio: RatioOption;
  resolution: ResolutionOption;
  style: StyleOption;
  numberOfOutputs: number;
  range?: number;
  seed?: string;
  negativePrompt?: string;
  prompt: string;
}

export type PhotoSonicFormData = z.infer<typeof PhotoSonicFormSchema>;

export interface UsePhotoSonicFormReturn {
  form: any; // Will be properly typed with react-hook-form
  isLoading: boolean;
  onSubmit: (data: PhotoSonicFormData) => Promise<void>;
}