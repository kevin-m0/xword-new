import { AiTextResolverOptions, AiTextStreamHandlerOptions } from '../types';
export declare const resolveAiStream: ({ action, text, textOptions, extensionOptions, aborter, }: AiTextResolverOptions) => Promise<ReadableStream<Uint8Array> | null>;
export declare const aiStreamCommand: ({ props, action, textOptions, extensionOptions, fetchDataFn, }: AiTextStreamHandlerOptions) => () => Promise<boolean>;
