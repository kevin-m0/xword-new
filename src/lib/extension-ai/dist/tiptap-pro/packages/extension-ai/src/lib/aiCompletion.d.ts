import { AiTextCompletionHandlerOptions, AiTextResolverOptions } from '../types';
export declare const resolveAiCompletion: ({ action, text, textOptions, extensionOptions, }: AiTextResolverOptions) => Promise<string | null>;
export declare const aiCompletionCommand: ({ props, action, textOptions, extensionOptions, fetchDataFn, }: AiTextCompletionHandlerOptions) => () => Promise<boolean>;
