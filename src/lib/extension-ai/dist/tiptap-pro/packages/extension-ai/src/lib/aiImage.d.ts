import { AiImageHandlerOptions, AiImageResolverOptions } from '../types';
export declare const resolveAiImage: ({ text, imageOptions, extensionOptions, }: AiImageResolverOptions) => Promise<string | null>;
export declare const aiImageCommand: ({ props, imageOptions, extensionOptions, fetchDataFn, }: AiImageHandlerOptions) => () => Promise<boolean>;
