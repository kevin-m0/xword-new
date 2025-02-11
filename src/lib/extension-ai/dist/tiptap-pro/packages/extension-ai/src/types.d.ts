import { CommandProps, Editor } from '@tiptap/core';
import { Language } from './language';
export * from './language';
export type OpenAITextModel = 'gpt-4' | 'gpt-4-turbo-preview' | 'gpt-4-0125-preview' | 'gpt-4-1106-preview' | 'gpt-4-0613' | 'gpt-4-32k' | 'gpt-4-32k-0613' | 'gpt-3.5-turbo-0125' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-1106' | 'gpt-3.5-turbo-16k';
export type TextAction = 'shorten' | 'extend' | 'emojify' | 'de-emojify' | 'simplify' | 'rephrase' | 'complete' | 'fix-spelling-and-grammar' | 'translate' | 'adjust-tone' | 'summarize' | 'prompt' | 'tldr';
export type TextLength = number;
export type TextLengthUnit = 'paragraphs' | 'words' | 'characters';
export type Tone = 'default' | 'academic' | 'business' | 'casual' | 'childfriendly' | 'confident' | 'conversational' | 'creative' | 'emotional' | 'excited' | 'formal' | 'friendly' | 'funny' | 'humorous' | 'informative' | 'inspirational' | 'memeify' | 'narrative' | 'objective' | 'persuasive' | 'poetic' | string;
export type ImageAction = 'prompt';
export type ImageStyle = 'photorealistic' | 'digital_art' | 'comic_book' | 'neon_punk' | 'isometric' | 'line_art' | '3d_model' | string;
export type ImageSize = '256x256' | '512x512' | '1024x1024';
export interface TextOptions {
    text?: string;
    tone?: Tone | string;
    language?: Language;
    textLength?: TextLength;
    textLengthUnit?: TextLengthUnit;
    plainText?: boolean;
    useHeading?: boolean;
    stream?: boolean;
    append?: boolean;
    collapseToEnd?: boolean;
    modelName?: OpenAITextModel;
    [key: string]: any;
}
export interface ImageOptions {
    text?: string;
    modelName?: 'dall-e-2' | 'dall-e-3' | null;
    style?: ImageStyle;
    size?: ImageSize;
}
export interface AutocompletionOptions {
    trigger?: string;
    inputLength?: number;
    modelName?: OpenAITextModel;
}
export interface AiOptions {
    appId: string;
    token: string;
    baseUrl?: string;
    autocompletion?: boolean;
    autocompletionOptions?: AutocompletionOptions;
    collapseToEnd?: boolean;
    onLoading?: () => void;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}
export interface AiPluginOptions {
    editor: Editor;
    appId: string;
    token: string;
    baseUrl: string;
    onLoading?: () => void;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}
export interface AiAutocompletionPluginOptions {
    appId: string;
    token: string;
    trigger: string;
    inputLength: number;
    modelName?: OpenAITextModel;
    baseUrl: string;
}
export interface AiTextStreamHandlerOptions {
    props: CommandProps;
    action: TextAction;
    textOptions: TextOptions;
    extensionOptions: any;
    fetchDataFn: (options: AiTextResolverOptions) => Promise<ReadableStream<Uint8Array> | null>;
    defaultResolver: (options: AiTextResolverOptions) => Promise<ReadableStream<Uint8Array> | null>;
}
export interface AiTextCompletionHandlerOptions {
    props: CommandProps;
    action: TextAction;
    textOptions: TextOptions;
    extensionOptions: any;
    fetchDataFn: (options: AiTextResolverOptions) => Promise<string | null>;
    defaultResolver: (options: AiTextResolverOptions) => Promise<string | null>;
}
export interface AiImageHandlerOptions {
    props: CommandProps;
    text: string;
    imageOptions: ImageOptions;
    extensionOptions: any;
    fetchDataFn: (options: AiImageResolverOptions) => Promise<string | null>;
}
export interface AiTextResolverOptions {
    action: TextAction;
    text: string;
    textOptions: TextOptions;
    extensionOptions: any;
    aborter?: AbortController;
    defaultResolver: (options: AiTextResolverOptions) => Promise<string | null> | Promise<ReadableStream<Uint8Array> | null>;
}
export interface AiImageResolverOptions {
    text: string;
    imageOptions: ImageOptions;
    extensionOptions: any;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        ai: {
            aiAdjustTone: (tone: Tone, options?: TextOptions) => ReturnType;
            aiComplete: (options?: TextOptions) => ReturnType;
            aiEmojify: (options?: TextOptions) => ReturnType;
            aiDeEmojify: (options?: TextOptions) => ReturnType;
            aiExtend: (options?: TextOptions) => ReturnType;
            aiFixSpellingAndGrammar: (options?: TextOptions) => ReturnType;
            aiImagePrompt: (options?: ImageOptions) => ReturnType;
            aiRephrase: (options?: TextOptions) => ReturnType;
            aiShorten: (options?: TextOptions) => ReturnType;
            aiSimplify: (options?: TextOptions) => ReturnType;
            aiSummarize: (options?: TextOptions) => ReturnType;
            aiTextPrompt: (options?: TextOptions) => ReturnType;
            aiTranslate: (language: Language, options?: TextOptions) => ReturnType;
            aiTldr: (options?: TextOptions) => ReturnType;
        };
    }
}
