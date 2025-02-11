import { Mark } from '@tiptap/core';
export interface AiMarkOptions {
    HTMLAttributes: Record<string, any>;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        aiMark: {
            /**
             * Set a AI mark
             */
            setAiMark: () => ReturnType;
            /**
             * Toggle a AI mark
             */
            toggleAiMark: () => ReturnType;
            /**
             * Unset a AI mark
             */
            unsetAiMark: () => ReturnType;
        };
    }
}
export declare const AiMark: Mark<AiMarkOptions, any>;
